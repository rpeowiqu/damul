package com.damul.api.admin.service;

import com.damul.api.admin.dto.response.AdminUserDetail;
import com.damul.api.admin.dto.response.AdminUserList;
import com.damul.api.admin.dto.response.ReportDetail;
import com.damul.api.admin.dto.response.ReportList;
import com.damul.api.common.exception.BusinessException;
import com.damul.api.common.exception.ErrorCode;
import com.damul.api.common.page.PageInfo;
import com.damul.api.common.page.PageResponse;
import com.damul.api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminServiceImpl implements AdminService {
    private final UserRepository userRepository;

    @Override
    public PageResponse<ReportList> getReportList(int currentPage, int pageSize, String searchType, String keyword) {
        return null;
    }

    @Override
    public ReportDetail getReportDetail(int reportId) {
        return null;
    }

    @Override
    public void updateReportStatus(String status, int targetId) {

    }

    @Override
    public PageResponse<AdminUserList> getUsers(int currentPage, int pageSize, String searchType, String keyword) {
        log.info("서비스: 관리자 - 유저 전체 조회 및 검색 시작 - page: {}, size: {}, searchType: {}, keyword: {}",
                currentPage, pageSize, searchType, keyword);

        validateSearchType(searchType);

        Pageable pageable = PageRequest.of(currentPage - 1, pageSize);
        Page<AdminUserList> userPage = userRepository.findUsersWithSearch(searchType, keyword, pageable);

        PageInfo pageInfo = PageInfo.builder()
                .totalElements((int) userPage.getTotalElements())
                .totalPages(userPage.getTotalPages())
                .build();

        log.info("서비스: 관리자 - 유저 전체 조회 및 검색 완료 - 총 건수: {}", userPage.getTotalElements());

        return new PageResponse<>(userPage.getContent(), pageInfo);
    }

    @Override
    public AdminUserDetail getUserDetail(int userId) {
        return null;
    }

    private void validateSearchType(String searchType) {
        if (searchType != null && !searchType.isEmpty()) {
            boolean isValid = switch (searchType) {
                case "nickname", "email" -> true;
                default -> false;
            };
            if (!isValid) {
                throw new BusinessException(ErrorCode.INVALID_SEARCH_TYPE, "존재하지 않는 검색 타입입니다.");
            }
        }
    }

}
