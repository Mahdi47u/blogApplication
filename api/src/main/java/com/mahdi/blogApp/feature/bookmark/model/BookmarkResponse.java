package com.mahdi.blogApp.feature.bookmark.model;

import com.mahdi.blogApp.feature.post.model.PostResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookmarkResponse {

    private Long id;

    private Long userId;

    private PostResponse post;

    private LocalDateTime createdAt;
}
