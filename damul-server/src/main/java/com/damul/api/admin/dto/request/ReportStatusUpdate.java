package com.damul.api.admin.dto.request;

import com.damul.api.report.entity.type.ReportStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportStatusUpdate {
    private ReportStatus status;
    private int targetId;
}
