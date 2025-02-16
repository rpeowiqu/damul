package com.damul.api.report.dto.response;

import com.damul.api.report.entity.ReportCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportCategoryResponse {
    private List<ReportCategory> content;
}
