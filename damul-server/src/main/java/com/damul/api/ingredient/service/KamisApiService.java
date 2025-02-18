package com.damul.api.ingredient.service;

import com.damul.api.common.exception.BusinessException;
import com.damul.api.common.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.util.UriComponentsBuilder;
import reactor.netty.http.client.HttpClient;

import java.net.URI;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.PriorityQueue;

@Slf4j
@Service
@RequiredArgsConstructor
public class KamisApiService {
    private final WebClient.Builder webClientBuilder;

    @Value("${KAMIS_KEY}")
    private String apiKey;


    private static final String KAMIS_BASE_URL = "http://www.kamis.or.kr/service/price/xml.do";
    private static final String KAMIS_API_ID = "5234";
    private static final String KAMIS_RETURN_TYPE = "json";
    private static final String CONVERT_KG_YN = "N";
    private static final String ECO_ACTION = "periodEcoPriceList";
    private static final String RETAIL_ACTION = "periodRetailProductList";


    public String getPrice(String itemCode, String kindCode, boolean ecoFlag, String period) {
        String kamisAction = ecoFlag ? ECO_ACTION : RETAIL_ACTION;
        log.info("Kamis API 호출 시작 - itemCode: {}, kindCode: {}, ecoFlag: {}", itemCode, kindCode, ecoFlag);


        // 날짜 계산
        LocalDate endDate = LocalDate.now();
        LocalDate startDate;

        if ("monthly".equals(period)) {
            // 6개월 전부터 현재까지
            startDate = endDate.minusMonths(6)
                    .withDayOfMonth(1)  // 6개월 전 월의 1일
                    .plusMonths(1);
        } else if ("recent".equals(period)) {
            // 1개월 전부터 현재까지
            startDate = endDate.minusMonths(1)
                    .withDayOfMonth(1);
        } else {
            // 기본값으로 6개월 설정
            startDate = endDate.minusMonths(6)
                    .withDayOfMonth(1)
                    .plusMonths(1);
        }

        try {
            URI fullUri = UriComponentsBuilder.fromUriString(KAMIS_BASE_URL)
                    .queryParam("action", kamisAction)
                    .queryParam("p_cert_key", apiKey)
                    .queryParam("p_cert_id", KAMIS_API_ID)
                    .queryParam("p_returntype", KAMIS_RETURN_TYPE)
                    .queryParam("p_startday", startDate.format(DateTimeFormatter.ISO_LOCAL_DATE))
                    .queryParam("p_endday", endDate.format(DateTimeFormatter.ISO_LOCAL_DATE))
                    .queryParam("p_itemcode", itemCode)
                    .queryParam("p_kindcode", kindCode)
                    .queryParam("p_convert_kg_yn", CONVERT_KG_YN)
                    .build()
                    .toUri();


            log.info("Kamis API 호출 URL: {}", fullUri.toString()); // URL 로깅

            String response = webClientBuilder.baseUrl(KAMIS_BASE_URL)
                    .codecs(configurer -> configurer
                            .defaultCodecs()
                            .maxInMemorySize(5 * 1024 * 1024) // 5MB로 버퍼 크기 증가
                    )
                    .defaultHeader("User-Agent", "Mozilla/5.0")
                    .clientConnector(new ReactorClientHttpConnector(
                            HttpClient.create()
                                    .followRedirect(true)
                                    .compress(true) // 압축 응답 허용
                    ))
                    .build()
                    .get()
                    .uri(uriBuilder -> uriBuilder
                            .queryParam("action", kamisAction)
                            .queryParam("p_cert_key", apiKey)
                            .queryParam("p_cert_id", KAMIS_API_ID)
                            .queryParam("p_returntype", KAMIS_RETURN_TYPE)
                            .queryParam("p_startday", startDate.format(DateTimeFormatter.ISO_LOCAL_DATE))
                            .queryParam("p_endday", endDate.format(DateTimeFormatter.ISO_LOCAL_DATE))
                            .queryParam("p_itemcode", itemCode)
                            .queryParam("p_kindcode", kindCode)
                            .queryParam("p_convert_kg_yn", CONVERT_KG_YN)
                            .build())
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();



            //log.error("Full API Response: {}", response); // 실제 응답 내용 로깅

            log.info("Kamis API 호출 완료");
            return response;
        } catch (Exception e) {
            log.error("Kamis API 호출 실패: {}", e.getMessage());
            throw new BusinessException(ErrorCode.API_SERVER_ERROR);
        }
    }
}