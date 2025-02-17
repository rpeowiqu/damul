package com.damul.api.admin.dto.response;

import com.damul.api.report.entity.type.ReportStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportList {
    private int id;
    private String nickname;
    private String categoryName;
    private String description;
    private ReportStatus status;
}
