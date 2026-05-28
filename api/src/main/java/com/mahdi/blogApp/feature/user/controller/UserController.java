package com.mahdi.blogApp.feature.user.controller;


import com.mahdi.blogApp.feature.user.model.ChangePasswordRequest;
import com.mahdi.blogApp.feature.user.model.BioUpdateRequest;
import com.mahdi.blogApp.feature.user.model.ProfileResponse;
import com.mahdi.blogApp.feature.user.model.PublicProfileResponse;
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
    public ProfileResponse getCurrentUser(Authentication auth) {
        String username = auth.getName();
        return userService.getProfileByUsername(username);
    }

    @GetMapping("/{id}/profile")
    public ResponseEntity<PublicProfileResponse> getPublicProfile(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getPublicProfileById(id));
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
    public ResponseEntity<ProfileResponse> updateBio(
            @RequestBody BioUpdateRequest request,
            Authentication auth) {

        String username = auth.getName();

        ProfileResponse updatedUser = userService.updateBio(username, request.getBio());

        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/me/profile-picture")
    public ResponseEntity<ProfileResponse> updateProfilePicture(
            @RequestBody String imageUrl,
            Authentication auth) {

        String username = auth.getName();

        ProfileResponse updatedUser =
                userService.updateProfilePictureUrl(username, imageUrl);

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
