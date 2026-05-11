package com.mahdi.blogApp.feature.comment.service;

import com.mahdi.blogApp.feature.comment.entity.CommentEntity;
import com.mahdi.blogApp.feature.comment.entity.CommentLikeEntity;
import com.mahdi.blogApp.feature.comment.repository.CommentLikeRepository;
import com.mahdi.blogApp.feature.comment.repository.CommentRepository;
import com.mahdi.blogApp.feature.user.entity.UserEntity;
import com.mahdi.blogApp.feature.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CommentLikeService {

    private final CommentLikeRepository commentLikeRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;

    public void likeComment(Long commentId, Long userId) {

        boolean alreadyLiked =
                commentLikeRepository.existsByUserIdAndCommentId(userId, commentId);

        // Important duplicate prevention
        if (alreadyLiked) {
            return;
        }

        CommentEntity comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CommentLikeEntity like = new CommentLikeEntity();
        like.setComment(comment);
        like.setUser(user);

        commentLikeRepository.save(like);

        // Cached like count update
        comment.setLikeCount(comment.getLikeCount() + 1);

        commentRepository.save(comment);
    }

    public void unlikeComment(Long commentId, Long userId) {

        boolean alreadyLiked = commentLikeRepository.existsByUserIdAndCommentId(userId, commentId);

        // without below if state user can infinite likes the posts.
        if (!alreadyLiked) {
            return;
        }

        commentLikeRepository.deleteByUserIdAndCommentId(userId, commentId);

        CommentEntity comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        comment.setLikeCount(comment.getLikeCount() - 1);

        commentRepository.save(comment);
    }

    public boolean isLikedByUser(Long commentId, Long userId) {

        return commentLikeRepository.existsByUserIdAndCommentId(userId, commentId);
    }

    public long getLikeCount(Long commentId) {

        return commentLikeRepository.countByCommentId(commentId);
    }
}
