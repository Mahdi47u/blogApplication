package com.mahdi.blogApp.feature.post.model;


import lombok.*;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostCreateRequest {

    private String title;

    private String content;

    private Set<Long> categoryIds;

}