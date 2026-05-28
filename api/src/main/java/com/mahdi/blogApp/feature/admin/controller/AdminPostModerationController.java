package com.mahdi.blogApp.feature.admin.controller;

import com.mahdi.blogApp.feature.admin.service.AdminPostModerationService;
import com.mahdi.blogApp.feature.post.model.PostResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/posts")
@PreAuthorize("hasRole('ADMIN') or hasRole('SUPERADMIN')")
@RequiredArgsConstructor
public class AdminPostModerationController {

    private final AdminPostModerationService adminPostModerationService;

    @GetMapping
    public ResponseEntity<Page<PostResponse>> getAllPosts(Pageable pageable) {

        return ResponseEntity.ok(
                adminPostModerationService.getAllPosts(pageable)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {

        adminPostModerationService.deletePost(id);

        return ResponseEntity.noContent().build();
    }
}
