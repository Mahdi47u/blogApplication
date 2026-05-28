package com.mahdi.blogApp.feature.admin.service;

import com.mahdi.blogApp.feature.admin.mapper.AdminDashboardMapper;
import com.mahdi.blogApp.feature.admin.model.*;
import com.mahdi.blogApp.feature.bookmark.repository.BookmarkRepository;
import com.mahdi.blogApp.feature.category.repository.CategoryRepository;
import com.mahdi.blogApp.feature.comment.repository.CommentRepository;
import com.mahdi.blogApp.feature.post.repository.PostRepository;
import com.mahdi.blogApp.feature.user.entity.Role;
import com.mahdi.blogApp.feature.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final CategoryRepository categoryRepository;
    private final BookmarkRepository bookmarkRepository;
    private final AdminDashboardMapper adminDashboardMapper;

    @Transactional(readOnly = true)
    public AdminDashboardResponse getDashboard() {

        long totalUsers = userRepository.count();
        long totalPosts = postRepository.count();
        long totalComments = commentRepository.count();
        long totalCategories = categoryRepository.count();
        long totalBookmarks = bookmarkRepository.count();
        long regularUsers = userRepository.countByRolesContaining(Role.USER);
        long admins = userRepository.countByRolesContaining(Role.ADMIN);
        long superAdmins = userRepository.countByRolesContaining(Role.SUPERADMIN);

        AdminDashboardResponse response = new AdminDashboardResponse();
        response.setTotalUsers(totalUsers);
        response.setTotalPosts(totalPosts);
        response.setTotalComments(totalComments);
        response.setTotalCategories(totalCategories);
        response.setTotalBookmarks(totalBookmarks);
        response.setRegularUsers(regularUsers);
        response.setAdmins(admins);
        response.setSuperAdmins(superAdmins);
        response.setMetrics(buildMetrics(totalUsers, totalPosts, totalComments, totalCategories, totalBookmarks));
        response.setRecentUsers(getRecentUsers());
        response.setRecentPosts(getRecentPosts());
        response.setActions(buildActions());
        response.setGeneratedAt(LocalDateTime.now());

        return response;
    }

    private List<AdminMetricResponse> buildMetrics(
            long totalUsers,
            long totalPosts,
            long totalComments,
            long totalCategories,
            long totalBookmarks
    ) {
        return List.of(
                new AdminMetricResponse("Users", totalUsers, "Registered accounts"),
                new AdminMetricResponse("Posts", totalPosts, "Published blog posts"),
                new AdminMetricResponse("Comments", totalComments, "Reader discussions"),
                new AdminMetricResponse("Categories", totalCategories, "Content groups"),
                new AdminMetricResponse("Bookmarks", totalBookmarks, "Saved posts")
        );
    }

    private List<AdminRecentUserResponse> getRecentUsers() {

        return userRepository
                .findAll(PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt")))
                .stream()
                .map(adminDashboardMapper::toRecentUser)
                .toList();
    }

    private List<AdminRecentPostResponse> getRecentPosts() {

        return postRepository
                .findAll(PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt")))
                .stream()
                .map(adminDashboardMapper::toRecentPost)
                .toList();
    }

    private List<AdminActionResponse> buildActions() {

        return List.of(
                new AdminActionResponse(
                        "Manage Users",
                        "Review accounts, roles, and access.",
                        "/admin/users"
                ),
                new AdminActionResponse(
                        "Moderate Posts",
                        "Review and remove posts when needed.",
                        "/admin/posts"
                ),
                new AdminActionResponse(
                        "Categories",
                        "Organize content discovery.",
                        "/admin/categories"
                )
        );
    }
}
