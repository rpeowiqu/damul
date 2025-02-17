package com.damul.api.admin.service;

import com.damul.api.admin.dto.response.AdminUserDetail;
import com.damul.api.admin.dto.response.AdminUserList;
import com.damul.api.admin.dto.response.ReportDetail;
import com.damul.api.admin.dto.response.ReportList;
import com.damul.api.common.page.PageResponse;

public interface AdminService {
    PageResponse<ReportList> getReportList(int currentPage, int pageSize, String searchType, String keyword);
    ReportDetail getReportDetail(int reportId);
    void updateReportStatus(String status, int targetId);
    PageResponse<AdminUserList> getUsers(int currentPage, int pageSize, String searchType, String keyword);
    AdminUserDetail getUserDetail(int userId);
}
