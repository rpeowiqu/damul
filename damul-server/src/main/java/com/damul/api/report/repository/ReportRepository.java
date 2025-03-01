package com.damul.api.report.repository;

import com.damul.api.admin.dto.response.ReportDetail;
import com.damul.api.admin.dto.response.ReportList;
import com.damul.api.report.entity.Report;
import com.damul.api.report.entity.type.ReportStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReportRepository extends JpaRepository<Report, Integer> {

    @Query("""
            SELECT new com.damul.api.admin.dto.response.ReportList(
                r.id,
                r.reporter.nickname,
                r.category.name,
                r.description,
                r.status
            )
            FROM Report r
            WHERE (:searchType = 'reportId' AND CAST(r.id AS string) LIKE %:keyword%)
                OR (:searchType = 'nickname' AND r.reporter.nickname LIKE %:keyword%)
                OR (:searchType IS NULL OR :searchType = '')
            """)
    Page<ReportList> findReportsWithSearch(
            @Param("searchType") String searchType,
            @Param("keyword") String keyword,
            Pageable pageable
    );

//    @Query("""
//        SELECT new com.damul.api.admin.dto.response.ReportDetail(
//            r.id,
//            r.reporter.nickname,
//            r.target.id,
//            r.target.nickname,
//            r.category.name,
//            r.reportType,
//            r.contentId,
//            r.description,
//            r.reportImageUrl,
//            r.status
//        )
//        FROM Report r
//        WHERE r.id = :reportId
//        """)
//    Optional<ReportDetail> findReportDetailById(@Param("reportId") int reportId);

    @Modifying
    @Query("UPDATE Report r SET r.status = :status WHERE r.id = :reportId")
    void updateReportStatus(@Param("reportId") int reportId, @Param("status") ReportStatus status);

}
