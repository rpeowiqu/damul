package com.damul.api.admin.service;

import com.damul.api.admin.dto.response.ReportList;
import com.damul.api.common.page.PageResponse;

public interface AdminService {
    PageResponse<ReportList> getReportList(int currentPage, int pageSize, String searchType, String keyword);

}
