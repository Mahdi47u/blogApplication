package com.mahdi.blogApp.feature.comment.model.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CommentCreateRequest {

    private Long postId;

    private String text;

    private Long parentId; // optional for replies
}