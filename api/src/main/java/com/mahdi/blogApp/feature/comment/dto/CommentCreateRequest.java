package com.mahdi.blogApp.feature.comment.dto;

public class CommentCreateRequest {

    private Long postId;

    private String text;

    private Long parentId; // optional for replies
}