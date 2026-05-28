package com.mahdi.blogApp.feature.bookmark.controller;

import com.mahdi.blogApp.feature.bookmark.service.BookmarkService;
import com.mahdi.blogApp.feature.bookmark.model.BookmarkResponse;
import com.mahdi.blogApp.feature.user.entity.UserEntity;
import com.mahdi.blogApp.feature.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookmarks")
@RequiredArgsConstructor
public class BookmarkController {

    private final BookmarkService bookmarkService;
    private final UserRepository userRepository;

    @PostMapping("/{postId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('SUPERADMIN')")
    public void savePost(@PathVariable Long postId) {

        Long userId = getCurrentUserId();

        bookmarkService.savePost(postId, userId);
    }

    @DeleteMapping("/{postId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('SUPERADMIN')")
    public void unsavePost(@PathVariable Long postId) {

        Long userId = getCurrentUserId();

        bookmarkService.unsavePost(postId, userId);
    }

    @GetMapping("/{postId}/saved")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('SUPERADMIN')")
    public boolean isSaved(@PathVariable Long postId) {

        Long userId = getCurrentUserId();

        return bookmarkService.isSavedByUser(postId, userId);
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('SUPERADMIN')")
    public Page<BookmarkResponse> getSavedPosts(Pageable pageable) {

        Long userId = getCurrentUserId();

        return bookmarkService.getSavedPosts(userId, pageable);
    }

    @GetMapping("/me/count")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('SUPERADMIN')")
    public long getSavedPostCount() {

        Long userId = getCurrentUserId();

        return bookmarkService.getSavedPostCount(userId);
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
