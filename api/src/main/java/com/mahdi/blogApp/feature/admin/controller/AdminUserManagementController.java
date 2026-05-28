package com.mahdi.blogApp.feature.admin.controller;

import com.mahdi.blogApp.feature.admin.model.AdminRoleUpdateRequest;
import com.mahdi.blogApp.feature.admin.model.AdminCreateUserRequest;
import com.mahdi.blogApp.feature.admin.service.AdminUserManagementService;
import com.mahdi.blogApp.feature.user.model.UserModel;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN') or hasRole('SUPERADMIN')")
public class AdminUserManagementController {

    private final AdminUserManagementService adminUserManagementService;

    @PostMapping("/admins")
    @PreAuthorize("hasRole('SUPERADMIN')")
    public ResponseEntity<UserModel> createAdmin(@RequestBody AdminCreateUserRequest request) {

        UserModel userModel = UserModel.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(request.getPassword())
                .build();

        return ResponseEntity.ok(adminUserManagementService.createAdmin(userModel));
    }

    @GetMapping
    public ResponseEntity<List<UserModel>> getAllUsers() {

        return ResponseEntity.ok(adminUserManagementService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserModel> getUserById(@PathVariable Long id) {

        return ResponseEntity.ok(adminUserManagementService.getUserById(id));
    }

    @PutMapping("/{id}/roles")
    public ResponseEntity<UserModel> updateUserRole(
            @PathVariable Long id,
            @RequestBody AdminRoleUpdateRequest request
    ) {

        return ResponseEntity.ok(
                adminUserManagementService.updateUserRole(id, request.getRole())
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {

        adminUserManagementService.deleteUser(id);

        return ResponseEntity.noContent().build();
    }
}
