package com.damul.api.auth.repository;

import com.damul.api.auth.dto.TermsList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TermsRepository extends JpaRepository<TermsList, Long> {
    List<TermsList> findAll();
}
