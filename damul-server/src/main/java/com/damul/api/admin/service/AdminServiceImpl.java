package com.damul.api.admin.service;

import com.damul.api.admin.dto.response.ReportList;
import com.damul.api.common.page.PageResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {
    @Override
    public PageResponse<ReportList> getReportList(int currentPage, int pageSize, String searchType, String keyword) {
        return null;
    }
}
