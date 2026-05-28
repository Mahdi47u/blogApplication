package com.mahdi.blogApp.feature.post.controller;

import com.mahdi.blogApp.feature.post.model.PostCreateRequest;
import com.mahdi.blogApp.feature.post.model.PostResponse;
import com.mahdi.blogApp.feature.post.model.PostUpdateRequest;
import com.mahdi.blogApp.feature.post.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public ResponseEntity<PostResponse> createPost(@RequestBody PostCreateRequest request) {

        PostResponse createdPost = postService.createPost(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdPost);
    }

    @PreAuthorize("permitAll()")
    @GetMapping
    public ResponseEntity<Page<PostResponse>> getAllPosts(Pageable pageable) {

        return ResponseEntity.ok(
                postService.getAllPosts(pageable)
        );
    }

    @PreAuthorize("permitAll()")
    @GetMapping("/search")
    public ResponseEntity<Page<PostResponse>> searchPosts(
            @RequestParam(defaultValue = "") String query,
            Pageable pageable
    ) {

        return ResponseEntity.ok(
                postService.searchPosts(query, pageable)
        );
    }

    @PreAuthorize("permitAll()")
    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getPostById(@PathVariable Long id) {

        return ResponseEntity.ok(
                postService.getPostById(id)
        );
    }

    @PreAuthorize("permitAll()")
    @GetMapping("/category/{category}")
    public ResponseEntity<Page<PostResponse>> getPostsByCategory(
            @PathVariable String category,
            Pageable pageable
    ) {

        return ResponseEntity.ok(
                postService.getPostsByCategory(category, pageable)
        );
    }

    @PreAuthorize("permitAll()")
    @GetMapping("/author/{authorId}")
    public ResponseEntity<Page<PostResponse>> getPostsByAuthor(
            @PathVariable Long authorId,
            Pageable pageable
    ) {

        return ResponseEntity.ok(
                postService.getPostsByAuthor(authorId, pageable)
        );
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping("/{id}")
    public ResponseEntity<PostResponse> updatePost(
            @PathVariable Long id,
            @RequestBody PostUpdateRequest request
    ) {

        return ResponseEntity.ok(
                postService.updatePost(id, request)
        );
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {

        postService.deletePost(id);

        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/me")
    public ResponseEntity<Page<PostResponse>> getMyPosts(Pageable pageable) {

        return ResponseEntity.ok(
                postService.getMyPosts(pageable)
        );
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/me/count")
    public ResponseEntity<Long> getMyPostCount() {

        return ResponseEntity.ok(
                postService.getMyPostCount()
        );
    }

}
