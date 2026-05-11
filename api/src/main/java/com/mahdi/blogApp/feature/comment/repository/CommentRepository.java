package com.mahdi.blogApp.feature.comment.repository;

import com.mahdi.blogApp.feature.comment.entity.CommentEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CommentRepository extends JpaRepository<CommentEntity, Long> {
    @Query("""
SELECT c
FROM CommentEntity c
JOIN FETCH c.user
WHERE c.post.id = :postId
AND c.parent IS NULL
ORDER BY c.createdAt DESC
""")
    Page<CommentEntity> findRootCommentsWithUser(
            Long postId,
            Pageable pageable
    );

    @Query("""
SELECT c
FROM CommentEntity c
JOIN FETCH c.user
WHERE c.parent.id = :parentId
ORDER BY c.createdAt ASC
""")
    Page<CommentEntity> findRepliesWithUser(Long parentId, Pageable pageable);

    Optional<CommentEntity> findByIdAndPostId(Long id, Long postId);
}
