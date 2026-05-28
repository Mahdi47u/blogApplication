package com.mahdi.blogApp.feature.admin.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardResponse {

    private List<AdminMetricResponse> metrics;

    private long totalUsers;

    private long totalPosts;

    private long totalComments;

    private long totalCategories;

    private long totalBookmarks;

    private long regularUsers;

    private long admins;

    private long superAdmins;

    private List<AdminRecentUserResponse> recentUsers;

    private List<AdminRecentPostResponse> recentPosts;

    private List<AdminActionResponse> actions;

    private LocalDateTime generatedAt;
}
