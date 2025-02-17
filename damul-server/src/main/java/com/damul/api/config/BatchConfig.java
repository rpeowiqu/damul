package com.damul.api.config;

import io.netty.channel.ChannelOption;
import io.netty.handler.timeout.ReadTimeoutHandler;
import io.netty.handler.timeout.WriteTimeoutHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;

@Configuration
@EnableScheduling  // 스케줄링 기능 활성화
@EnableCaching    // 캐싱 기능 활성화
@RequiredArgsConstructor
public class BatchConfig {

    private final RedisConnectionFactory redisConnectionFactory;


    /**
     * Redis 캐시 매니저 설정
     * 가격 정보를 캐싱하기 위한 설정
     */
    @Bean
    public CacheManager cacheManager(RedisConnectionFactory redisConnectionFactory) {
        // Redis 캐시 기본 설정
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofHours(24))    // 캐시 유효 시간 24시간
                // 키 직렬화 설정 (String 형식)
                .serializeKeysWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(new StringRedisSerializer()))
                // 값 직렬화 설정 (JSON 형식)
                .serializeValuesWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(new GenericJackson2JsonRedisSerializer()));

        // Redis 캐시 매니저 생성 및 반환
        return RedisCacheManager.builder(redisConnectionFactory)
                .cacheDefaults(config)
                .build();
    }

    /**
     * WebClient 빌더 설정
     * Kamis API 호출을 위한 HTTP 클라이언트 설정
     */
    @Bean
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder()
                // 코덱 설정 (최대 메모리 크기 5MB)
                .codecs(configurer -> configurer
                        .defaultCodecs()
                        .maxInMemorySize(5 * 1024 * 1024))
                // HTTP 클라이언트 설정
                .clientConnector(new ReactorClientHttpConnector(
                        HttpClient.create()
                                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 5000)  // 연결 타임아웃 5초
                                .responseTimeout(Duration.ofSeconds(5))              // 응답 타임아웃 5초
                                .doOnConnected(conn -> conn
                                        .addHandlerLast(new ReadTimeoutHandler(5))   // 읽기 타임아웃
                                        .addHandlerLast(new WriteTimeoutHandler(5)))  // 쓰기 타임아웃
                                .compress(true)       // 응답 압축 활성화
                                .followRedirect(true) // 리다이렉트 자동 처리
                ));
    }
}