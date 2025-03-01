package com.damul.api.config;

import com.damul.api.common.exception.BusinessException;
import com.damul.api.ingredient.dto.FoodCategory;
import com.damul.api.ingredient.entity.FoodItem;
import com.damul.api.ingredient.repository.FoodItemRepository;
import com.damul.api.ingredient.service.PriceBatchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.*;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.ItemWriter;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.transaction.PlatformTransactionManager;

import java.util.List;

@Slf4j
@Configuration
@EnableBatchProcessing
@EnableScheduling
@RequiredArgsConstructor
public class BatchConfig {
    private final JobRepository jobRepository;  // Spring Batch의 Job 관련 메타데이터를 저장/관리
    private final JobLauncher jobLauncher;      // Job을 실행하기 위한 런처
    private final PlatformTransactionManager transactionManager; // 트랜잭션 처리를 위한 매니저
    private final PriceBatchService priceBatchService;
    private final FoodItemRepository foodItemRepository;


    @Bean
    public Job priceUpdateJob() {
        return new JobBuilder("priceUpdateJob", jobRepository)
                .incrementer(new RunIdIncrementer())
                .listener(jobExecutionListener())  // 매 실행마다 고유한 run.id 파라미터 생성
                .start(createStep(FoodCategory.VEGETABLE))// Job 실행 전/후 이벤트 리스너
                .next(createStep(FoodCategory.FRUIT))
                .next(createStep(FoodCategory.DAIRY))
                .next(createStep(FoodCategory.MEAT))
                .next(createStep(FoodCategory.EGG))
                .next(createStep(FoodCategory.SEAFOOD))
                .next(createStep(FoodCategory.OIL))
                .next(createStep(FoodCategory.SEASONING))
                .next(createStep(FoodCategory.OTHER))
                .build();
    }

    // Job 실행 상태를 모니터링하기 위한 리스너
    @Bean
    public JobExecutionListener jobExecutionListener() {
        return new JobExecutionListener() {
            @Override
            public void beforeJob(JobExecution jobExecution) {
                log.info("Job 시작: {}", jobExecution.getJobInstance().getJobName());
            }

            @Override
            public void afterJob(JobExecution jobExecution) {
                log.info("Job 종료: {} (상태: {})",
                        jobExecution.getJobInstance().getJobName(),
                        jobExecution.getStatus());
            }
        };
    }

    private Step createStep(FoodCategory category) {
        return new StepBuilder(category.getName() + "Step", jobRepository)
                .<FoodItem, FoodItem>chunk(10, transactionManager)  // 청크 단위로 처리, 10개씩 트랜잭션
                .reader(itemReader(category))    // DB에서 데이터 읽기
                .processor(itemProcessor())      // 데이터 처리 (API 호출)
                .writer(itemWriter())           // 처리 결과 로깅
                .faultTolerant()               // 오류 허용 설정 시작
                .retry(BusinessException.class) // API 예외 발생 시 재시도
                .retryLimit(3)                 // 최대 3번까지 재시도
                .skip(BusinessException.class)  // 해당 예외 발생 시 건너뛰기
                .skipLimit(10)                 // 최대 10개까지 건너뛰기 허용
                .build();
    }

    private ItemReader<FoodItem> itemReader(FoodCategory category) {
        // 카테고리별 상품 목록을 DB에서 읽어오는 Reader
        return new ItemReader<FoodItem>() {
            private List<FoodItem> items;  // 카테고리별 전체 상품 목록
            private int currentIndex = 0;   // 현재 처리 중인 상품 인덱스

            @Override
            public FoodItem read() {
                if (items == null) {  // 최초 실행 시 DB에서 데이터 조회
                    items = foodItemRepository.findByCategoryId(category.getId());
                }

                // 순차적으로 상품 반환, 모든 상품 처리 완료 시 null 반환
                if (currentIndex < items.size()) {
                    return items.get(currentIndex++);
                }
                return null;  // null 반환 시 Reader 종료
            }
        };
    }

    private ItemProcessor<FoodItem, FoodItem> itemProcessor() {
        // 각 상품의 가격 정보를 API로 조회하여 처리
        return item -> {
            try {
                // monthly와 recent 두 가지 기간의 가격 정보 업데이트
                priceBatchService.updateItemPrice(item, "monthly", item.isEcoFlag());
                priceBatchService.updateItemPrice(item, "recent", item.isEcoFlag());
                Thread.sleep(1000); // API 호출 간격 1초 유지
                return item;
            } catch (Exception e) {
                log.error("상품[{}] 가격 업데이트 실패: {}", item.getItemName(), e.getMessage());
                return null;  // null 반환 시 해당 아이템은 Writer로 전달되지 않음
            }
        };
    }

    private ItemWriter<FoodItem> itemWriter() {
        // 처리 완료된 상품 목록을 로깅
        return items -> {
            items.forEach(item ->
                    log.info("상품[{}] 처리 완료", item.getItemName())
            );
        };
    }

    //@Scheduled(cron = "0 41 1 * * *")  // 기존 스케줄링 시간 유지
    public void runJob() {
        log.info("Batch Job 실행 시도 시작"); // 로그 추가
        try {
            // Job 실행 시 고유한 파라미터 생성 (같은 파라미터로 중복 실행 방지)
            JobParameters jobParameters = new JobParametersBuilder()
                    .addLong("time", System.currentTimeMillis())
                    .toJobParameters();
            // Job 실행
            jobLauncher.run(priceUpdateJob(), jobParameters);
        } catch (Exception e) {
            log.error("배치 작업 실행 실패: {}", e.getMessage());
        }
    }
}