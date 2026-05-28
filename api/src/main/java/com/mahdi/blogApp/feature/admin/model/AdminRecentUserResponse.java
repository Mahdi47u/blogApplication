package com.mahdi.blogApp.feature.admin.model;

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
public class AdminRecentUserResponse {

    private Long id;

    private String username;

    private String email;

    private Set<Role> roles;

    private boolean enabled;

    private LocalDateTime createdAt;
}
