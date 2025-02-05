package com.damul.api.file.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileInfo {
    private String originalFileName;
    private String storedFileName; // UUID로 저장된 파일명
    private String filePath;       // 실제 저장 경로
    private String fileUrl;        // 접근 URL
}
