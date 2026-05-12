package com.mahdi.blogApp.feature.comment.controller;

import com.mahdi.blogApp.feature.comment.model.dto.CommentCreateRequest;
import com.mahdi.blogApp.feature.comment.model.dto.CommentUpdateRequest;
import com.mahdi.blogApp.feature.comment.model.CommentModel;
import com.mahdi.blogApp.feature.comment.service.CommentService;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public CommentModel createComment(
            @RequestBody CommentCreateRequest request
    ) {
        return commentService.createComment(request);
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping("/{commentId}")
    public CommentModel updateComment(
            @PathVariable Long commentId,
            @RequestBody CommentUpdateRequest request
    ) {
        return commentService.updateComment(commentId, request);
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{commentId}")
    public void deleteComment(
            @PathVariable Long commentId
    ) {
        commentService.deleteComment(commentId);
    }

    @PreAuthorize("permitAll()")
    @GetMapping("/post/{postId}")
    public Page<CommentModel> getRootComments(
            @PathVariable Long postId,
            Pageable pageable
    ) {
        return commentService.getRootComments(postId, pageable);
    }

    @PreAuthorize("permitAll()")
    @GetMapping("/{commentId}/replies")
    public Page<CommentModel> getReplies(
            @PathVariable Long commentId,
            Pageable pageable
    ) {
        return commentService.getReplies(commentId, pageable);
    }
}
