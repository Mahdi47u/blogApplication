package com.mahdi.blogApp.feature.admin.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminRecentPostResponse {

    private Long id;

    private String title;

    private Long authorId;

    private String authorName;

    private Set<String> categories;

    private LocalDateTime createdAt;
}
