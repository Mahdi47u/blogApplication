package com.mahdi.blogApp.feature.post.model;


import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostResponse {

    private Long id;

    private String title;

    private String content;

    private String coverImageUrl;

    private String thumbnailUrl;

    private Long authorId;

    private String authorName;

    private String authorAvatar;

    private Set<String> categories;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}
