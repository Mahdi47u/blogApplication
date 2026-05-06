package com.mahdi.blogApp.feature.user.controller;


import com.mahdi.blogApp.feature.user.model.ChangePasswordRequest;
import com.mahdi.blogApp.feature.user.model.UserModel;
import com.mahdi.blogApp.feature.user.service.UserManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserManagementService userService;

    // ------------------------------------------------------------
    // GET CURRENT USER
    // ------------------------------------------------------------
    @GetMapping("/me")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('SUPERADMIN')")
    public UserModel getCurrentUser(Authentication auth) {
        String username = auth.getName();
        return userService.getUserByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // ------------------------------------------------------------
    // UPDATE CURRENT USER
    // ------------------------------------------------------------
    @PutMapping("/me")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('SUPERADMIN')")
    public UserModel updateCurrentUser(
            @RequestBody UserModel userModel,
            Authentication auth) {

        String username = auth.getName();
        var currentUser = userService.getUserByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long userId = currentUser.getId();

        return userService.updateUser(userModel, userId);
    }

    @PutMapping("/me/password")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('SUPERADMIN')")
    public ResponseEntity<Map<String, String>> changePassword(
            @RequestBody ChangePasswordRequest request,
            Authentication auth) {

        String username = auth.getName();
        userService.changePassword(username, request);

        return ResponseEntity.ok(Map.of("message", "Password updated successfully"));

    }

    @PutMapping("/me/bio")
    public ResponseEntity<UserModel> updateBio(
            @RequestBody String bio,
            Authentication auth) {

        String username = auth.getName();

        UserModel updatedUser = userService.updateBio(username, bio);

        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/me/profile-picture")
    public ResponseEntity<UserModel> updateProfilePicture(
            @RequestBody String imageUrl,
            Authentication auth) {

        String username = auth.getName();

        UserModel updatedUser =
                userService.updateProfilePicture(username, imageUrl);

        return ResponseEntity.ok(updatedUser);
    }

    @PostMapping(value = "/me/profile-picture", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserModel> uploadProfilePicture(
            @RequestParam("file") MultipartFile file,
            Authentication auth) {

        String username = auth.getName();

        UserModel updated = userService.updateProfilePicture(username, file);

        return ResponseEntity.ok(updated);
    }


}