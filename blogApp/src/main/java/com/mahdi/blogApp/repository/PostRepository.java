package com.mahdi.blogApp.repository;

import com.mahdi.blogApp.entity.PostEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<PostEntity, Long> {
    void deleteByTitle(String title);

    Optional<PostEntity> findByTitle(String title);
    List<PostEntity> findByCategory(String category);

    List<PostEntity> findByAuthorId(Long authorId);
}
