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
public class ReportDetail {
    private int id;
    private String nickname;
    private int targetId;
    private String targetName;
    private String categoryName;
    private String contentTypeName;
    private int contentId;
    private String description;
    private ReportStatus status;
}
