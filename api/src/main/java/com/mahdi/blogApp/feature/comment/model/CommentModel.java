package com.mahdi.blogApp.feature.comment.model;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CommentModel {

    private String id;
    private String text;
    private String author;
    private LocalDateTime createdAt;
    private long likeCount;
    private boolean edited;
    private String parentId;

}
