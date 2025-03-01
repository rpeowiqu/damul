package com.damul.api.report.service;

import com.damul.api.admin.dto.request.ReportStatusUpdate;
import com.damul.api.admin.dto.response.ReportDetail;
import com.damul.api.admin.dto.response.ReportList;
import com.damul.api.common.dto.response.CreateResponse;
import com.damul.api.common.page.PageResponse;
import com.damul.api.report.dto.request.ReportCreate;
import com.damul.api.report.dto.response.ReportCategoryResponse;

public interface ReportService {

    ReportCategoryResponse getReportCategory();

    CreateResponse addReport(ReportCreate report, int userId);

    PageResponse<ReportList> getReports(int currentPage, int pageSize, String searchType, String keyword);

//    ReportDetail getReport(int reportId);

    void updateReportStatus(int reportId, ReportStatusUpdate request);

}
