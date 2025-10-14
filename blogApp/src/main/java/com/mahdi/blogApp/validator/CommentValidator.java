package com.mahdi.blogApp.validator;

import com.mahdi.blogApp.entity.CommentEntity;
import com.mahdi.blogApp.model.CommentModel;
import com.mahdi.blogApp.repository.CommentRepository;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class CommentValidator {
    private final CommentRepository commentRepository;

    public CommentValidator(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    public void validateCreateComment(CommentModel comment) {
        if (comment.getPostId() == null) {
            throw new IllegalArgumentException("Post ID is required");
        }
        if (comment.getAuthorId() == null) {
            throw new IllegalArgumentException("Author ID is required");
        }
        if (comment.getContent() == null || comment.getContent().trim().isEmpty()) {
            throw new IllegalArgumentException("Comment content is required");
        }
        if (comment.getContent().length() < 5) {
            throw new IllegalArgumentException("Comment content must be at least 5 characters");
        }
    }

    public void validateApproveComment(Long commentId) {
        CommentEntity comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found with ID: " + commentId));

        if (comment.isApproved()) {
            throw new IllegalStateException("Comment is already approved");
        }
        if (containsUrls(comment.getContent())) {
            throw new IllegalArgumentException("Comment contains URLs, cannot be approved");
        }
        if (containsProfanity(comment.getContent())) {
            throw new IllegalArgumentException("Comment contains inappropriate language");
        }
        if (isDuplicateComment(comment)) {
            throw new IllegalArgumentException("Duplicate comment detected");
        }
    }

    public void validateDeleteComment(CommentModel comment) {
        if (comment.getPostId() == null) {
            throw new IllegalArgumentException("Post ID is required");
        }
    }

    private boolean containsUrls(String content) {
        return content != null && (content.contains("http://") || content.contains("https://"));
    }

    private boolean containsProfanity(String content) {
        List<String> bannedWords = Arrays.asList("badword1", "badword2");
        return content != null && bannedWords.stream()
                .anyMatch(word -> content.toLowerCase().contains(word.toLowerCase()));
    }

    public void deleteComment(CommentModel comment) {
        if (comment.getPostId() == null) {
            throw new IllegalArgumentException("Post is required");
        }

    }

    private boolean isDuplicateComment(CommentEntity comment) {
        return commentRepository.existsByAuthorIdAndPostIdAndContent(
                comment.getAuthor().getId(),
                comment.getPost().getId(),
                comment.getContent().trim()
        );
    }
}
