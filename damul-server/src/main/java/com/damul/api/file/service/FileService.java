package com.damul.api.file.service;

import java.io.File;
import java.io.IOException;
import com.damul.api.common.exception.BusinessException;
import com.damul.api.common.exception.ErrorCode;
import com.damul.api.file.dto.type.FileType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    public String uploadFile(MultipartFile file, FileType fileType) {
        try {
            // 원본 파일명에서 확장자 추출
            String originalFileName = file.getOriginalFilename();
            String fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));

            // UUID로 파일명 생성
            String storedFileName = UUID.randomUUID().toString() + fileExtension;

            // 파일 저장 경로 생성 (uploadDir/fileType의 directory)
            String directory = fileType.getDirectory();
            String filePath = uploadDir + "/" + directory;
            File uploadPath = new File(filePath);

            // 디렉토리가 없으면 생성
            if (!uploadPath.exists()) {
                uploadPath.mkdirs();
            }

            // 파일 저장
            File destFile = new File(filePath + "/" + storedFileName);
            file.transferTo(destFile);

            // 접근 가능한 URL 생성하여 반환
            return "/uploads/" + directory + "/" + storedFileName;

        } catch(Exception e) {
            log.error("uploadFile에서 에러가 발생했습니다.");
            throw new BusinessException(ErrorCode.FILE_UPLOAD_ERROR);
        }

    }
}

