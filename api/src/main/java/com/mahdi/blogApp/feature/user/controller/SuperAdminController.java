package com.mahdi.blogApp.feature.user.controller;

import com.mahdi.blogApp.feature.user.model.UserModel;
import com.mahdi.blogApp.feature.user.service.UserManagementService;
import com.mahdi.blogApp.feature.user.entity.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/superadmin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SUPERADMIN')")
public class SuperAdminController {

    private final UserManagementService userService;


    @PutMapping("/{id}/role/{role}")
    public UserModel updateUserRole(
            @PathVariable Long id,
            @PathVariable Role role
    ) {
        return userService.updateUserRole(id, role);
    }


    @PostMapping("/create-admin")
    public UserModel createAdmin(@RequestBody UserModel userModel) {

        userModel.setRoles(Set.of(Role.ADMIN));

        return userService.createUser(userModel);
    }
}
