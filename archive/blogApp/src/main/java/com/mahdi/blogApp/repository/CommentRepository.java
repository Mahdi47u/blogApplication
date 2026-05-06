package com.mahdi.blogApp.repository;

import com.mahdi.blogApp.entity.CommentEntity;
import com.mahdi.blogApp.entity.PostEntity;
import com.mahdi.blogApp.entity.UserEntity;
import org.hibernate.query.Page;
import org.springframework.data.jpa.repository.JpaRepository;

import java.awt.print.Pageable;
import java.util.List;

public interface CommentRepository extends JpaRepository<CommentEntity, Long> {
/*
    Page<CommentEntity> findByAuthorId(Long postId, Pageable pageable);
*/
    List<CommentEntity> findByIsApprovedFalse();
    boolean existsByAuthorIdAndPostIdAndContent(Long authorId, Long postId, String content);

}
