package com.mahdi.blogApp.feature.user.controller;

import com.mahdi.blogApp.feature.user.entity.Role;
import com.mahdi.blogApp.feature.user.model.UserModel;
import com.mahdi.blogApp.feature.user.service.UserManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/admin/users") // Base path for admin user operations
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN') or hasRole('SUPERADMIN')") // Restrict all endpoints in this controller to ADMIN or SUPERADMIN
public class AdminUserController {

    private final UserManagementService userManagementService;

    @GetMapping
    public ResponseEntity<List<UserModel>> getAllUsers() {
        return ResponseEntity.ok(userManagementService.getAllUsers());
    }


    @GetMapping("/{id}")
    public ResponseEntity<UserModel> getUserById(@PathVariable Long id) {
        return userManagementService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserModel> updateUser(
            @PathVariable Long id,
            @RequestBody UserModel userModel) {

        // You might want to add logic here to prevent an ADMIN from promoting another ADMIN to SUPERADMIN,
        // or prevent users from demoting themselves if they are the only SUPERADMIN.
        UserModel updatedUser = userManagementService.updateUser(userModel, id);
        return ResponseEntity.ok(updatedUser);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        // Add logic to prevent deleting the last SUPERADMIN or oneself.
        userManagementService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }


    @PutMapping("/{id}/roles")
    public ResponseEntity<UserModel> updateUserRole(
            @PathVariable Long id,
            @RequestBody Role role) {

        UserModel updatedUser = userManagementService.updateUserRole(id, role);
        return ResponseEntity.ok(updatedUser);
    }
}
