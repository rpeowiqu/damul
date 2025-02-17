package com.damul.api.report.service;

import com.damul.api.auth.entity.User;
import com.damul.api.common.TimeZoneConverter;
import com.damul.api.common.dto.response.CreateResponse;
import com.damul.api.common.exception.BusinessException;
import com.damul.api.common.exception.ErrorCode;
import com.damul.api.report.dto.request.ReportCreate;
import com.damul.api.report.dto.response.ReportCategoryResponse;
import com.damul.api.report.entity.Report;
import com.damul.api.report.entity.ReportCategory;
import com.damul.api.report.entity.type.ReportType;
import com.damul.api.report.repository.ReportCategoryRepository;
import com.damul.api.report.repository.ReportRepository;
import com.damul.api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {
    private final ReportCategoryRepository reportCategoryRepository;
    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final TimeZoneConverter timeZoneConverter;

    @Override
    public ReportCategoryResponse getReportCategory() {
        log.info("신고 카테고리 조회 시작");
        List<ReportCategory> response = reportCategoryRepository.findAll();
        log.info("신고 카테고리 조회 성공");
        return ReportCategoryResponse.builder()
                .content(response).build();
    }

    @Override
    public CreateResponse addReport(ReportCreate reportCreate, int userId) {
        log.info("신고 추가 시작");
        // User와 Category 엔티티 조회
        log.info("userID : {} ", userId);
        User reporter = userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.error("신고자의 ID가 존재하지 않습니다");
                    throw new BusinessException(ErrorCode.USER_FORBIDDEN);
                });

        log.info("targetId : " + reportCreate.getTargetId());
        User target = userRepository.findById(reportCreate.getTargetId())
                .orElseThrow(() -> {
                    log.error("신고 당한 유저의 ID가 존재하지 않습니다");
                    throw new BusinessException(ErrorCode.USER_FORBIDDEN);
                });


        ReportCategory category = reportCategoryRepository.findById(reportCreate.getReportCategoryId())
                .orElseThrow(() -> {
                    log.error("존재하지 않는 신고 카테고리 입니다");
                    throw new BusinessException(ErrorCode.INVALID_CATEGORY);
                });


        // Report 엔티티 생성
        Report report = Report.builder()
                .reporter(reporter)
                .target(target)
                .category(category)
                .reportType(ReportType.valueOf(reportCreate.getReportType().name()))
                .description(reportCreate.getDescription())
                .build();
        report.updateCreatedAt(timeZoneConverter.convertUtcToSeoul(LocalDateTime.now()));

        Report savedReport = reportRepository.save(report);  // 저장된 엔티티를 받아옴

        return new CreateResponse(savedReport.getId());
    }
}
