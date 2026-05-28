package com.mahdi.blogApp.feature.admin.service;

import com.mahdi.blogApp.feature.post.entity.PostEntity;
import com.mahdi.blogApp.feature.post.mapper.PostMapper;
import com.mahdi.blogApp.feature.post.model.PostResponse;
import com.mahdi.blogApp.feature.post.repository.PostRepository;
import com.mahdi.blogApp.feature.user.entity.Role;
import com.mahdi.blogApp.feature.user.entity.UserEntity;
import com.mahdi.blogApp.feature.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminPostModerationService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final PostMapper postMapper;

    @Transactional(readOnly = true)
    public Page<PostResponse> getAllPosts(Pageable pageable) {

        return postRepository
                .findAll(pageable)
                .map(postMapper::toResponse);
    }

    @Transactional
    public void deletePost(Long postId) {

        UserEntity currentUser = getCurrentUser();
        PostEntity post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        ensureCanModeratePost(currentUser, post);

        postRepository.delete(post);
    }

    private void ensureCanModeratePost(UserEntity currentUser, PostEntity post) {

        if (currentUser.getRoles().contains(Role.SUPERADMIN)) {
            return;
        }

        if (
                currentUser.getRoles().contains(Role.ADMIN) &&
                post.getAuthor().getRoles().contains(Role.USER) &&
                !post.getAuthor().getRoles().contains(Role.ADMIN) &&
                !post.getAuthor().getRoles().contains(Role.SUPERADMIN)
        ) {
            return;
        }

        throw new RuntimeException("You are not allowed to moderate this post");
    }

    private UserEntity getCurrentUser() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("Unauthenticated");
        }

        return userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("Current user not found"));
    }
}
