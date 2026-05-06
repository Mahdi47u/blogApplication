package com.mahdi.blogApp.model;



import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CommentModel {
    private String content;
    private Long postId;   // reference post by ID
    private Long authorId; // reference user by ID
    private LocalDateTime createdAt;
    private boolean isApproved;
}

