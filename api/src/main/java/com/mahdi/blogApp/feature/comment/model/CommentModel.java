package com.mahdi.blogApp.feature.comment.model;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CommentModel {

    private Long id;

    private String text;

    private Long authorId;

    private String authorUsername;

    private LocalDateTime createdAt;

    private long likeCount;

    private boolean edited;

    private Long parentId;
}
