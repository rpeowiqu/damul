package com.damul.api.damulserver.auth.repository;

import com.damul.api.damulserver.auth.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    boolean existsByEmail(String email);
// SELECT EXISTS(SELECT 1 FROM user WHERE email = ?) 쿼리 자동 생성

    Optional<User> findByEmail(String email);
// SELECT * FROM user WHERE email = ? 쿼리 자동 생성

    User save(User user);
// INSERT 또는 UPDATE 쿼리 자동 생성

}
