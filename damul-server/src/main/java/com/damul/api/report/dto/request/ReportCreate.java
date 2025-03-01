package com.damul.api.report.dto.request;

import com.damul.api.report.entity.type.ReportType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportCreate {
    private int reportCategoryId;
    private ReportType reportType;
    private int contentId;
    private int targetId;
    private String description;
}
