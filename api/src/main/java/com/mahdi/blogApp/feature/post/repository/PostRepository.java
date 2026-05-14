package com.mahdi.blogApp.feature.post.repository;

import com.mahdi.blogApp.feature.post.entity.PostEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<PostEntity, Long> {

    Page<PostEntity> findAll(Pageable pageable);

    Page<PostEntity> findByCategories_Name(String category, Pageable pageable);

    Page<PostEntity> findByCategories_Id(Long categoryId, Pageable pageable);

    Page<PostEntity> findByAuthorId(Long authorId, Pageable pageable);

    long countByAuthorId(Long authorId);

    Page<PostEntity> findByTitleContainingIgnoreCase(String title, Pageable pageable);
}