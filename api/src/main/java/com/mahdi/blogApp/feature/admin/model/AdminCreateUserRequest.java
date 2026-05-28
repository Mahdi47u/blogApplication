package com.mahdi.blogApp.feature.admin.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminCreateUserRequest {

    private String username;

    private String email;

    private String password;
}
