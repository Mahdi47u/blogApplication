package com.mahdi.blogApp.feature.post.validator;

import com.mahdi.blogApp.feature.post.model.PostCreateRequest;
import com.mahdi.blogApp.feature.post.model.PostUpdateRequest;
import org.springframework.stereotype.Component;

@Component
public class PostValidator {

    public void createOrUpdatePost(PostCreateRequest request) {

        if (request == null) {
            throw new IllegalArgumentException("Post data is required");
        }

        validateTitle(request.getTitle());
        validateContent(request.getContent());
        validateCategories(request.getCategoryIds());
    }

    public void createOrUpdatePost(PostUpdateRequest request) {

        if (request == null) {
            throw new IllegalArgumentException("Post data is required");
        }

        validateTitle(request.getTitle());
        validateContent(request.getContent());
        validateCategories(request.getCategoryIds());
    }

    private void validateTitle(String title) {

        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("Title is required");
        }

        if (title.length() > 150) {
            throw new IllegalArgumentException("Title cannot exceed 150 characters");
        }
    }

    private void validateContent(String content) {

        if (content == null || content.isBlank()) {
            throw new IllegalArgumentException("Content is required");
        }
    }

    private void validateCategories(java.util.Set<Long> categoryIds) {

        if (categoryIds == null || categoryIds.isEmpty()) {
            throw new IllegalArgumentException("At least one category is required");
        }
    }

    public void deletePost(Long postId) {

        if (postId == null) {
            throw new IllegalArgumentException("PostId is required");
        }

        if (postId <= 0) {
            throw new IllegalArgumentException("Invalid PostId");
        }
    }
}
