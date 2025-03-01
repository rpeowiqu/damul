package com.damul.api.config.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.AmazonS3Exception;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.damul.api.common.exception.BusinessException;
import com.damul.api.common.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class S3Service {
    private final AmazonS3 amazonS3;

    @Value("${spring.cloud.aws.s3.bucket}")
    private String bucket;

    // 파일 업로드
    public String uploadFile(MultipartFile file) {
        try {
            log.info("S3 업로드 시작");
            log.info("버킷 이름: {}", bucket);
            log.info("Amazon S3 Client: {}", amazonS3);
            // 버킷 존재 여부 확인
            boolean isBucketExist = amazonS3.doesBucketExistV2(bucket);
            log.info("버킷 존재 여부: {}", isBucketExist);

            // 버킷 리전 확인
            String bucketRegion = amazonS3.getBucketLocation(bucket);
            log.info("버킷 리전: {}", bucketRegion);

            String fileName = createFileName(file.getOriginalFilename());
            log.info("파일 이름 설정 - fileName: {}", fileName);

            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType(file.getContentType());
            metadata.setContentLength(file.getSize());

            log.info("metadata: {}", metadata);
            log.info("bucket: {}", bucket);
            amazonS3.putObject(bucket, fileName, file.getInputStream(), metadata);
            log.info("S3 업로드 완료");
            return amazonS3.getUrl(bucket, fileName).toString();
        } catch (IOException e) {
            log.error("S3 업로드에 실패했습니다.");
            throw new BusinessException(ErrorCode.FILE_UPLOAD_ERROR);
        } catch (Exception e) {
            log.error("S3 에서 오류 발생");
            System.out.println(e.getMessage());
            throw new BusinessException(ErrorCode.FILE_UPLOAD_ERROR);
        }
    }

    // 파일명 생성
    private String createFileName(String originalFileName) {
        return UUID.randomUUID().toString() + "-" + originalFileName;
    }

    // 파일 삭제
    public void deleteFile(String fileName) {
        try {
            log.info("파일 삭제 시작 - {}", fileName);
            amazonS3.deleteObject(bucket, fileName);
            log.info("파일 삭제 완료 - {}", fileName);
        } catch (AmazonS3Exception e) {
            log.error("Error deleting file from S3 - {}", fileName, e);
            throw new BusinessException(ErrorCode.FILE_DELETE_FAILED);
        } catch (Exception ee) {
            log.error("파일 삭제 중 오류가 생겼습니다.");
            throw new BusinessException(ErrorCode.FILE_DELETE_FAILED);
        }
    }

    // 파일명 추출
    public String extractFileNameFromUrl(String url) {
        try {
            log.info("파일명 추출 시작 - url: {}", url);
            return url.substring(url.lastIndexOf("/") + 1);
        } catch (Exception e) {
            log.error("URL에서 파일명 추출 실패: {}", url);
            throw new RuntimeException("잘못된 파일 URL 입니다.", e);
        }
    }
}
