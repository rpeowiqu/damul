package com.damul.api.auth.repository;

import com.damul.api.auth.dto.TermsResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TermsRepository extends JpaRepository<TermsResponse, Long> {
    List<TermsResponse> findAll();
}
