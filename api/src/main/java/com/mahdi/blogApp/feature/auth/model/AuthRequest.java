package com.mahdi.blogApp.feature.auth.model;



import lombok.Data;

@Data
public class AuthRequest {
    private String username;
    private String password;
}