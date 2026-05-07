package com.mahdi.blogApp.feature.user.controller;

import com.mahdi.blogApp.feature.post.repository.PostRepository;
import com.mahdi.blogApp.feature.user.entity.Role;
import com.mahdi.blogApp.feature.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/stats")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN') or hasRole('SUPERADMIN')")
public class AdminStatsController {

    private final UserRepository userRepository;
    private final PostRepository postRepository;

    @GetMapping
    public Map<String, Object> getStats() {

        long totalUsers = userRepository.count();
        long totalPosts = postRepository.count();

        long adminCount = userRepository.countByRolesContaining(Role.ADMIN);
        long userCount = userRepository.countByRolesContaining(Role.USER);
        long superAdminCount = userRepository.countByRolesContaining(Role.SUPERADMIN);

        return Map.of(
                "totalUsers", totalUsers,
                "totalPosts", totalPosts,
                "admins", adminCount,
                "users", userCount,
                "superAdmins", superAdminCount
        );
    }
}
