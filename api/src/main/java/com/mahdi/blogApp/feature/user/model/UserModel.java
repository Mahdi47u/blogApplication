package com.mahdi.blogApp.feature.user.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.mahdi.blogApp.feature.user.entity.Role;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserModel {

    private Long id;
    private String username;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    private String email;

    private String bio;

    private String profilePicture;

    private Set<Role> roles;

    private boolean enabled;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}
