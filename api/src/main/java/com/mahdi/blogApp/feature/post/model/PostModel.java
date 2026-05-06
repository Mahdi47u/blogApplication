package com.mahdi.blogApp.feature.post.model;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class PostModel {

    private Long id;

    private String title;

    private String content;

    private Long authorId;

    private String category;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}