package com.damul.api.report.service;

import com.damul.api.common.dto.response.CreateResponse;
import com.damul.api.report.dto.request.ReportCreate;
import com.damul.api.report.dto.response.ReportCategoryResponse;

public interface ReportService {
    ReportCategoryResponse getReportCategory();

    CreateResponse addReport(ReportCreate report, int userId);
}
