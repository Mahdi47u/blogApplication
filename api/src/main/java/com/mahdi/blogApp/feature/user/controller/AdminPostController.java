package com.mahdi.blogApp.feature.user.controller;

import com.mahdi.blogApp.feature.post.model.PostModel;
import com.mahdi.blogApp.feature.post.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/posts")
@PreAuthorize("hasRole('ADMIN') or hasRole('SUPERADMIN')")
@RequiredArgsConstructor
public class AdminPostController {

    @Autowired
    private PostService postService;

    @GetMapping
    public ResponseEntity<Page<PostModel>> getAllPosts(Pageable pageable) {
        return ResponseEntity.ok(postService.getAllPosts(pageable));
    }

    @DeleteMapping("/{id}")
    public void deletePost(@PathVariable Long id) {
        postService.deletePost(id);
    }

}