package com.mahdi.blogApp.feature.comment.dto;

import java.time.LocalDateTime;

public class CommentResponse {

    private Long id;

    private String text;

    private String author;

    private String authorAvatar;

    private LocalDateTime createdAt;

    private boolean edited;

    private int likeCount;

    private Long parentId;
}
