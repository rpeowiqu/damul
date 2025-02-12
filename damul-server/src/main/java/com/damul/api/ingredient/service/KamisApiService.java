package com.damul.api.ingredient.service;

import com.damul.api.common.exception.BusinessException;
import com.damul.api.common.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.beans.factory.annotation.Value;
import reactor.netty.http.client.HttpClient;

@Slf4j
@Service
@RequiredArgsConstructor
public class KamisApiService {
    private final WebClient.Builder webClientBuilder;

    @Value("${KAMIS_KEY}")
    private String apiKey;

    private static final String KAMIS_BASE_URL = "http://www.kamis.or.kr/service/price/xml.do";

    public String getPrice(String period, String productNo, String yearCode) {
        log.info("Kamis API 호출 시작 - period: {}, productNo: {}", period, productNo);

        try {
            String response = webClientBuilder.baseUrl(KAMIS_BASE_URL)
                    .defaultHeader("User-Agent", "Mozilla/5.0")
                    .clientConnector(new ReactorClientHttpConnector(
                            HttpClient.create().followRedirect(true)
                    ))
                    .build()
                    .get()
                    .uri(uriBuilder -> uriBuilder
                            .queryParam("action", yearCode)
                            .queryParam("p_cert_key", apiKey)
                            .queryParam("p_cert_id", "5234")
                            .queryParam("p_returntype", "json")
                            //.queryParam("p_datecode", "1")
                            .queryParam("p_regday", period)
                            .queryParam("p_productno", productNo)
                            //.queryParam("p_productclscode", "02")
                            .build())
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            log.info("Kamis API 호출 완료");
            log.info("Kamis API 응답 데이터: {}", response);
            return response;
        } catch (Exception e) {
            log.error("Kamis API 호출 실패: {}", e.getMessage());
            throw new BusinessException(ErrorCode.EXTERNAL_API_ERROR);
        }
    }
}