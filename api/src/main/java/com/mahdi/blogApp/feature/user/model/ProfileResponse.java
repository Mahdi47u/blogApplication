package com.mahdi.blogApp.feature.user.model;

import com.mahdi.blogApp.feature.user.entity.Role;
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
public class ProfileResponse {

    private Long id;

    private String username;

    private String email;

    private String bio;

    private String profilePicture;

    private Set<Role> roles;

    private boolean enabled;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
