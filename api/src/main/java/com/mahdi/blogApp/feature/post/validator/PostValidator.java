package com.mahdi.blogApp.feature.post.validator;

import com.mahdi.blogApp.feature.post.model.PostModel;
import org.springframework.stereotype.Component;

@Component
public class PostValidator {

    public void createOrUpdatePost(PostModel postModel) {

        if (postModel == null) {
            throw new IllegalArgumentException("Post data is required");
        }

        if (postModel.getTitle() == null || postModel.getTitle().isBlank()) {
            throw new IllegalArgumentException("Title is required");
        }

        if (postModel.getTitle().length() > 150) {
            throw new IllegalArgumentException("Title cannot exceed 150 characters");
        }

        if (postModel.getContent() == null || postModel.getContent().isBlank()) {
            throw new IllegalArgumentException("Content is required");
        }

        if (postModel.getCategory() == null || postModel.getCategory().isBlank()) {
            throw new IllegalArgumentException("Category is required");
        }

        if (postModel.getCategory().length() > 50) {
            throw new IllegalArgumentException("Category too long");
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