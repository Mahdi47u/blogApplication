package com.mahdi.blogApp.controller;


import com.mahdi.blogApp.model.PostModel;
import com.mahdi.blogApp.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/post/")
@RequiredArgsConstructor
public class PostController {
    private final PostService postService;

    @PostMapping
    public ResponseEntity<PostModel> createPost(@RequestBody PostModel postModel) {
        PostModel createdPost = postService.createPost(postModel);
        return new ResponseEntity<>(createdPost, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<PostModel>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostModel> getPostById(@PathVariable Long id) throws Exception{
        return ResponseEntity.ok(postService.getPostById(id));
    }

    @GetMapping("/title")
    public ResponseEntity<PostModel> getPostsByTitle(@RequestParam String title) {
        return ResponseEntity.ok(postService.getPostByTitle(title));
    }

    @GetMapping("/category")
    public ResponseEntity<List<PostModel>> getPostsByCategory(@RequestParam String category) {
        return ResponseEntity.ok(postService.getPostsByCategory(category));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PostModel> updatePost(@PathVariable Long id, @RequestBody PostModel postModel) {
        return ResponseEntity.ok(postService.updatePost(postModel, id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deletePostsByTitle(@RequestParam String title) {
        postService.deletePostByTitle(title);
        return ResponseEntity.noContent().build();
    }
}
