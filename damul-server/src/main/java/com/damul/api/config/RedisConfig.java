package com.damul.api.config;


import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

/*
 * Redis 설정을 위한 Configuration 클래스
 * Redist는 인메모리 데이터 저장소로, 주로 캐시나 세션 관리에 사용함
 */
@Configuration
public class RedisConfig {

    @PostConstruct
    public void printRedisConfig() {
        System.out.println("Redis Host: " + redisHost);
        System.out.println("Redis Port: " + redisPort);
    }

    // application.yml에서 redis host 정보를 가져옴 (기본값: localhost)
    @Value("${REDIS_HOST:localhost}")
    private String redisHost;

    // application.yml에서 redis port 정보를 가져옴 (기본값: 6379)
    @Value("${REDIS_PORT:6379}")
    private int redisPort;

    /**
     * Redis 연결을 위한 Factory 빈 생성
     * Lettuce는 Redis 클라이언트 라이브러리로, 비동기 처리가 가능하다는 장점이 있음
     *
     * @return RedisConnectionFactory Redis 연결을 관리하는 팩토리 객체
     */
    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        return new LettuceConnectionFactory(redisHost, redisPort);
    }


    @Bean
    public RedisTemplate<String, String> redisTemplate() {
        RedisTemplate<String, String> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(redisConnectionFactory());

        // JSON 직렬화 설정
        GenericJackson2JsonRedisSerializer serializer = new GenericJackson2JsonRedisSerializer();

        // String 타입으로 통일
        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setValueSerializer(new StringRedisSerializer());
        redisTemplate.setHashKeySerializer(new StringRedisSerializer());
        redisTemplate.setHashValueSerializer(new StringRedisSerializer());

        return redisTemplate;
    }

    @Bean
    public RedisTemplate<String, Object> redisTemplateObject() {
        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(redisConnectionFactory());

        // Object JSON 직렬화를 위한 설정
        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setValueSerializer(new GenericJackson2JsonRedisSerializer());
        redisTemplate.setHashKeySerializer(new StringRedisSerializer());
        redisTemplate.setHashValueSerializer(new GenericJackson2JsonRedisSerializer());

        return redisTemplate;
    }
}