package com.mahdi.blogApp.feature.post.controller;

import com.mahdi.blogApp.feature.post.model.PostModel;
import com.mahdi.blogApp.feature.post.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public ResponseEntity<PostModel> createPost(@RequestBody PostModel postModel) {
        PostModel createdPost = postService.createPost(postModel);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPost);
    }

    @PreAuthorize("permitAll()")
    @GetMapping
    public ResponseEntity<Page<PostModel>> getAllPosts(Pageable pageable) {
        return ResponseEntity.ok(postService.getAllPosts(pageable));
    }

    @PreAuthorize("permitAll()")
    @GetMapping("/{id}")
    public ResponseEntity<PostModel> getPostById(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPostById(id));
    }

    @PreAuthorize("permitAll()")
    @GetMapping("/category/{category}")
    public ResponseEntity<Page<PostModel>> getPostsByCategory(
            @PathVariable String category,
            Pageable pageable
    ) {
        return ResponseEntity.ok(postService.getPostsByCategory(category, pageable));
    }

    @PreAuthorize("permitAll()")
    @GetMapping("/author/{authorId}")
    public ResponseEntity<Page<PostModel>> getPostsByAuthor(
            @PathVariable Long authorId,
            Pageable pageable
    ) {
        return ResponseEntity.ok(postService.getPostsByAuthor(authorId, pageable));
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping("/{id}")
    public ResponseEntity<PostModel> updatePost(
            @PathVariable Long id,
            @RequestBody PostModel postModel
    ) {
        return ResponseEntity.ok(postService.updatePost(id, postModel));
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/me")
    public ResponseEntity<Page<PostModel>> getMyPosts(Pageable pageable) {
        return ResponseEntity.ok(postService.getMyPosts(pageable));
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/me/count")
    public ResponseEntity<Long> getMyPostCount() {
        return ResponseEntity.ok(postService.getMyPostCount());
    }

//    @PostMapping("/{postId}/thumbnail")
//    public ResponseEntity<PostModel> uploadThumbnail(
//            @PathVariable Long postId,
//            @RequestParam("file") MultipartFile file
//    ) {
//        return ResponseEntity.ok(postService.uploadThumbnail(postId, file));
//    }
//
//    @PostMapping("/{postId}/media")
//    public ResponseEntity<PostModel> uploadMedia(
//            @PathVariable Long postId,
//            @RequestParam("files") List<MultipartFile> files
//    ) {
//        return ResponseEntity.ok(postService.uploadMedia(postId, files));
//    }


}