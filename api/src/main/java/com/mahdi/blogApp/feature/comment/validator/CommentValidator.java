package com.mahdi.blogApp.feature.comment.validator;

import com.mahdi.blogApp.feature.comment.repository.CommentRepository;
import com.mahdi.blogApp.feature.comment.model.dto.CommentCreateRequest;
import com.mahdi.blogApp.feature.comment.entity.CommentEntity;
import org.springframework.stereotype.Component;

@Component
public class CommentValidator {

    private final CommentRepository commentRepository;

    public CommentValidator(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    public void validateCreate(CommentCreateRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Request cannot be null");
        }

        if (request.getText() == null || request.getText().trim().isEmpty()) {
            throw new IllegalArgumentException("Comment text is required");
        }

        if (request.getText().length() > 1000) {
            throw new IllegalArgumentException("Comment must not exceed 1000 characters");
        }

        if (request.getPostId() == null) {
            throw new IllegalArgumentException("Post ID is required");
        }

        // If it's a reply, validate parent
        if (request.getParentId() != null) {
            CommentEntity parent = commentRepository.findById(request.getParentId())
                    .orElseThrow(() -> new IllegalArgumentException("Parent comment not found"));
            if (!parent.getPost().getId().equals(request.getPostId())) {
                throw new IllegalArgumentException("Parent comment must belong to the same post");
            }
        }
    }

    public void validateDelete(Long commentId) {
        if (commentId == null) {
            throw new IllegalArgumentException("Comment ID is required for deletion");
        }
    }
}
