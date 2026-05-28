package com.mahdi.blogApp.feature.bookmark.repository;

import com.mahdi.blogApp.feature.bookmark.entity.BookmarkEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface BookmarkRepository extends JpaRepository<BookmarkEntity, Long> {

    @Query("""
        SELECT COUNT(b) > 0
        FROM BookmarkEntity b
        WHERE b.user.id = :userId
        AND b.post.id = :postId
    """)
    boolean existsByUserIdAndPostId(Long userId, Long postId);

    @Query("""
        SELECT b
        FROM BookmarkEntity b
        WHERE b.user.id = :userId
        ORDER BY b.createdAt DESC
    """)
    Page<BookmarkEntity> findByUserId(Long userId, Pageable pageable);

    @Query("""
        SELECT COUNT(b)
        FROM BookmarkEntity b
        WHERE b.user.id = :userId
    """)
    long countByUserId(Long userId);

    @Modifying
    @Transactional
    @Query("""
        DELETE FROM BookmarkEntity b
        WHERE b.user.id = :userId
        AND b.post.id = :postId
    """)
    void deleteByUserIdAndPostId(Long userId, Long postId);
}
