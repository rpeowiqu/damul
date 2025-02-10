package com.damul.api.post.repository;

import com.damul.api.post.entity.Post;
import com.damul.api.post.entity.PostComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostCommentRepository extends JpaRepository<PostComment, Integer> {
    List<PostComment> findByPostOrderByCreatedAtDesc(Post post);
}
