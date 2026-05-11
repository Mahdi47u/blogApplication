package com.mahdi.blogApp.feature.comment.model.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CommentUpdateRequest {

    private String text;
}