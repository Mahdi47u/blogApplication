package com.mahdi.blogApp.feature.auth;

import com.mahdi.blogApp.feature.auth.model.AuthRequest;
import com.mahdi.blogApp.feature.auth.model.AuthResponse;
import com.mahdi.blogApp.feature.auth.model.RegisterRequest;
import com.mahdi.blogApp.feature.user.entity.Role;
import com.mahdi.blogApp.feature.user.service.UserManagementService;
import com.mahdi.blogApp.feature.user.model.UserModel;
import com.mahdi.blogApp.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserManagementService userManagementService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;


    // ------------------------------------------------------------ //
    // REGISTER
    // ------------------------------------------------------------ //
    public AuthResponse register(RegisterRequest request) {

        // Convert DTO → UserModel → UserEntity
        UserModel userModel = UserModel.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(request.getPassword())
                .roles(Set.of(Role.USER))  // every new user gets USER role
                .build();

        userManagementService.createUser(userModel);

        String token = jwtService.generateToken(request.getUsername());

        return new AuthResponse(token);
    }


    // ------------------------------------------------------------ //
    // LOGIN
    // ------------------------------------------------------------ //
    public AuthResponse login(AuthRequest request) {

        // 1. Validate username/password credentials
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        // 2. If success: generate JWT token
        String token = jwtService.generateToken(request.getUsername());

        return new AuthResponse(token);
    }
}
