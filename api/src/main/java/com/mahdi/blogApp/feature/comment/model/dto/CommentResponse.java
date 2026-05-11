package com.mahdi.blogApp.feature.comment.model.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CommentResponse {

    private Long id;

    private String text;

    private String author;

    private String authorAvatar;

    private LocalDateTime createdAt;

    private boolean edited;

    private long likeCount;

    private Long parentId;
}
