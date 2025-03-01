package com.damul.api.report.service;

import com.damul.api.admin.dto.request.ReportStatusUpdate;
import com.damul.api.admin.dto.response.ReportDetail;
import com.damul.api.admin.dto.response.ReportList;
import com.damul.api.auth.entity.User;
import com.damul.api.common.TimeZoneConverter;
import com.damul.api.common.dto.response.CreateResponse;
import com.damul.api.common.exception.BusinessException;
import com.damul.api.common.exception.ErrorCode;
import com.damul.api.common.page.PageInfo;
import com.damul.api.common.page.PageResponse;
import com.damul.api.report.dto.request.ReportCreate;
import com.damul.api.report.dto.response.ReportCategoryResponse;
import com.damul.api.report.entity.Report;
import com.damul.api.report.entity.ReportCategory;
import com.damul.api.report.entity.type.ReportStatus;
import com.damul.api.report.entity.type.ReportType;
import com.damul.api.report.repository.ReportCategoryRepository;
import com.damul.api.report.repository.ReportRepository;
import com.damul.api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
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

    @Override
    public PageResponse<ReportList> getReports(int currentPage, int pageSize, String searchType, String keyword) {
        log.info("서비스: 신고 목록 조회 시작 - page: {}, size: {}, searchType: {}, keyword: {}",
                currentPage, pageSize, searchType, keyword);

        validateSearchType(searchType);

        Pageable pageable = PageRequest.of(currentPage - 1, pageSize);
        Page<ReportList> reportPage = reportRepository.findReportsWithSearch(searchType, keyword, pageable);

        PageInfo pageInfo = PageInfo.builder()
                .totalElements((int) reportPage.getTotalElements())
                .totalPages(reportPage.getTotalPages())
                .build();

        log.info("서비스: 신고 목록 조회 완료 - 총 건수: {}", reportPage.getTotalElements());

        return new PageResponse<>(reportPage.getContent(), pageInfo);
    }

//    @Override
//    public ReportDetail getReport(int reportId) {
//        log.info("서비스: 신고 상세 조회 시작 - reportId: {}", reportId);
//
//        ReportDetail reportDetail = reportRepository.findReportDetailById(reportId)
//                .orElseThrow(() -> new BusinessException(ErrorCode.REPORT_NOT_FOUND, "존재하지 않는 신고입니다."));
//
//        log.info("서비스: 신고 상세 조회 완료 - reportId: {}", reportId);
//
//        return reportDetail;
//    }

    @Override
    @Transactional
    public void updateReportStatus(int reportId, ReportStatusUpdate request) {
        log.info("서비스: 신고 상태 변경 시작 - reportId: {}, status: {}", reportId, request.getStatus());

        // 신고 존재 여부 확인
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new BusinessException(ErrorCode.REPORT_NOT_FOUND, "존재하지 않는 신고입니다."));

        // 상태값 검증
        validateReportStatus(request.getStatus());

        // 타겟 유저 검증
        User targetUser = userRepository.findById(request.getTargetId())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND, "존재하지 않는 사용자입니다."));

        // 신고 상태 업데이트
        reportRepository.updateReportStatus(reportId, request.getStatus());

        // 완료 상태일 경우 신고 횟수 증가
        if ("RESOLVED".equals(request.getStatus())) {
            userRepository.incrementReportCount(request.getTargetId());
            log.info("서비스: 유저 신고 횟수 증가 완료 - userId: {}", request.getTargetId());
        }

        log.info("서비스: 신고 상태 변경 완료 - reportId: {}", reportId);
    }

    private void validateReportStatus(ReportStatus status) {
        if (status == null || (!status.equals(ReportStatus.PENDING) && !status.equals(ReportStatus.REJECTED) && !status.equals(ReportStatus.RESOLVED))) {
            throw new BusinessException(ErrorCode.INVALID_REPORT_STATUS, "유효하지 않은 신고 상태입니다.");
        }
    }

    private void validateSearchType(String searchType) {
        if (searchType != null && !searchType.isEmpty()) {
            boolean isValid = switch (searchType) {
                case "reportId", "nickname" -> true;
                default -> false;
            };
            if (!isValid) {
                throw new BusinessException(ErrorCode.INVALID_SEARCH_TYPE, "존재하지 않는 검색 타입입니다.");
            }
        }
    }
}
