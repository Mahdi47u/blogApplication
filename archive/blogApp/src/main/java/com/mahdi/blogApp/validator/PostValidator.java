package com.mahdi.blogApp.validator;

import com.mahdi.blogApp.model.PostModel;
import org.springframework.stereotype.Component;

@Component
public class PostValidator {

    public void createOrUpdatePost(PostModel postModel) {
        if(postModel.getTitle() == null || postModel.getTitle().trim().equals("")) {
            throw new IllegalArgumentException("Title is required");
        }
        if(postModel.getContent() == null || postModel.getContent().trim().equals("")) {
            throw new IllegalArgumentException("Content is required");
        }
        if (postModel.getAuthorId() == null ) {
            throw new IllegalArgumentException("Author is required");
        }
        if (postModel.getCategory() == null || postModel.getCategory().trim().equals("")) {
            throw new IllegalArgumentException("Category is required");
        }

    }

    public void deletePost(Long postId) {
        if (postId == null) {
            throw new IllegalArgumentException("PostId is required");
        }
    }
}
