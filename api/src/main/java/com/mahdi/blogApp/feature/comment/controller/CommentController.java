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

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public CommentModel createComment(
            @RequestBody CommentCreateRequest request
    ) {
        return commentService.createComment(request);
    }

    @PutMapping("/{commentId}")
    @PreAuthorize("hasRole('USER')")
    public CommentModel updateComment(
            @PathVariable Long commentId,
            @RequestBody CommentUpdateRequest request
    ) {
        return commentService.updateComment(commentId, request);
    }

    @DeleteMapping("/{commentId}")
    @PreAuthorize("hasRole('USER')")
    public void deleteComment(
            @PathVariable Long commentId
    ) {
        commentService.deleteComment(commentId);
    }

    @GetMapping("/post/{postId}")
    public Page<CommentModel> getRootComments(
            @PathVariable Long postId,
            Pageable pageable
    ) {
        return commentService.getRootComments(postId, pageable);
    }


    @GetMapping("/{commentId}/replies")
    public Page<CommentModel> getReplies(
            @PathVariable Long commentId,
            Pageable pageable
    ) {
        return commentService.getReplies(commentId, pageable);
    }
}
