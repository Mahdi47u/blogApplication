package com.mahdi.blogApp.feature.comment.controller;

import com.mahdi.blogApp.feature.comment.service.CommentLikeService;
import com.mahdi.blogApp.feature.user.entity.UserEntity;
import com.mahdi.blogApp.feature.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/comment-likes")
@RequiredArgsConstructor
public class CommentLikeController {

    private final CommentLikeService commentLikeService;
    private final UserRepository userRepository;

    @PostMapping("/{commentId}")
    @PreAuthorize("hasRole('USER')")
    public void likeComment(@PathVariable Long commentId) {

        Long userId = getCurrentUserId();

        commentLikeService.likeComment(commentId, userId);
    }

    @DeleteMapping("/{commentId}")
    @PreAuthorize("hasRole('USER')")
    public void unlikeComment(@PathVariable Long commentId) {

        Long userId = getCurrentUserId();

        commentLikeService.unlikeComment(commentId, userId);
    }


    @GetMapping("/{commentId}/liked")
    @PreAuthorize("hasRole('USER')")
    public boolean isLiked(@PathVariable Long commentId) {

        Long userId = getCurrentUserId();

        return commentLikeService.isLikedByUser(commentId, userId);
    }


    @GetMapping("/{commentId}/count")
    public long getLikeCount(@PathVariable Long commentId) {

        return commentLikeService.getLikeCount(commentId);
    }

    private Long getCurrentUserId() {

        Authentication auth = SecurityContextHolder
                .getContext()
                .getAuthentication();

        String username = auth.getName();

        UserEntity user = userRepository
                .findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return user.getId();
    }
}
