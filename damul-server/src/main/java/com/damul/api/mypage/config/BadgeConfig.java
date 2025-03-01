//package com.damul.api.mypage.config;
//
//import javax.sql.DataSource;
//
//import org.springframework.batch.core.Job;
//import org.springframework.batch.core.Step;
//import org.springframework.batch.core.job.builder.JobBuilder;
//import org.springframework.batch.core.repository.JobRepository;
//import org.springframework.batch.core.step.builder.StepBuilder;
//import org.springframework.batch.item.database.JdbcBatchItemWriter;
//import org.springframework.batch.item.database.builder.JdbcBatchItemWriterBuilder;
//import org.springframework.batch.item.file.FlatFileItemReader;
//import org.springframework.batch.item.file.builder.FlatFileItemReaderBuilder;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.core.io.ClassPathResource;
//import org.springframework.jdbc.datasource.DataSourceTransactionManager;
//
//@Configuration
//@RequiredArgsConstructor
//public class BadgeConfig {
//
//    private final JobRepository jobRepository;
//    private final PlatformTransactionManager transactionManager;
//    private final UserRepository userRepository;
//    private final BadgeService badgeService;
//    private final EntityManagerFactory entityManagerFactory;
//
//    @Bean
//    public Job badgeAwardJob() {
//        return new JobBuilder("badgeAwardJob", jobRepository)
//                .incrementer(new RunIdIncrementer())
//                .start(badgeAwardStep())
//                .build();
//    }
//
//    @Bean
//    public Step badgeAwardStep() {
//        return new StepBuilder("badgeAwardStep", jobRepository)
//                .<User, User>chunk(100, transactionManager)
//                .reader(userItemReader())
//                .processor(badgeProcessor())
//                .writer(chunk -> {
//                    for (User user : chunk.getItems()) {
//                        if (user != null) {
//                            log.info("Processed badges for user: {}", user.getId());
//                        }
//                    }
//                })
//                .build();
//    }
//
//    @Bean
//    public JpaPagingItemReader<User> userItemReader() {
//        return new JpaPagingItemReaderBuilder<User>()
//                .name("userItemReader")
//                .entityManagerFactory(entityManagerFactory)
//                .queryString("SELECT u FROM User u")
//                .pageSize(100)
//                .build();
//    }
//
//    @Bean
//    public ItemProcessor<User, User> badgeProcessor() {
//        return user -> {
//            try {
//                badgeService.checkJoinDayBadge(user);
//                badgeService.checkIngredientCategoryBadges(user);
//                badgeService.checkPostBadges(user);
//                badgeService.checkRecipeBadges(user);
//                badgeService.checkFollowerBadge(user);
//                return user;
//            } catch (Exception e) {
//                log.error("Error processing badges for user {}: {}", user.getId(), e.getMessage());
//                return null;
//            }
//        };
//    }
//}
