package com.mahdi.blogApp.feature.comment.repository;

import com.mahdi.blogApp.feature.comment.entity.CommentLikeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface CommentLikeRepository extends JpaRepository<CommentLikeEntity, Long> {

    @Query("""
        SELECT COUNT(cl) > 0
        FROM CommentLikeEntity cl
        WHERE cl.user.id = :userId
        AND cl.comment.id = :commentId
    """)
    boolean existsByUserIdAndCommentId(Long userId, Long commentId);

    @Query("""
        SELECT COUNT(cl)
        FROM CommentLikeEntity cl
        WHERE cl.comment.id = :commentId
    """)
    long countByCommentId(Long commentId);

    @Modifying
    @Transactional
    @Query("""
        DELETE FROM CommentLikeEntity cl
        WHERE cl.user.id = :userId
        AND cl.comment.id = :commentId
    """)
    void deleteByUserIdAndCommentId(Long userId, Long commentId);
}
