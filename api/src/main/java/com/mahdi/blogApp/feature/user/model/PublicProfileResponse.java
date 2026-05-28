package com.mahdi.blogApp.feature.user.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PublicProfileResponse {

    private Long id;

    private String username;

    private String bio;

    private String profilePicture;

    private LocalDateTime createdAt;
}
