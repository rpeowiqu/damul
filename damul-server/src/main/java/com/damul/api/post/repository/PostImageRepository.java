package com.damul.api.post.repository;

import com.damul.api.post.entity.Post;
import com.damul.api.post.entity.PostImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostImageRepository extends JpaRepository<PostImage, Integer> {
    List<PostImage> findByPostOrderByImageUrl(Post post);
}
