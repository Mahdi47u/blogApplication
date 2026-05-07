package com.mahdi.blogApp.feature.post.service;

import com.mahdi.blogApp.feature.post.entity.PostEntity;
import com.mahdi.blogApp.feature.post.mapper.PostMapper;
import com.mahdi.blogApp.feature.post.model.PostModel;
import com.mahdi.blogApp.feature.post.repository.PostRepository;
import com.mahdi.blogApp.feature.post.validator.PostValidator;
import com.mahdi.blogApp.feature.user.entity.Role;
import com.mahdi.blogApp.feature.user.entity.UserEntity;
import com.mahdi.blogApp.feature.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final PostMapper postMapper;
    private final PostValidator postValidator;
    private final UserRepository userRepository;

    // ============================================================
    // Create Post
    // ============================================================
    public PostModel createPost(PostModel postModel) {

        postValidator.createOrUpdatePost(postModel);

        // authorId from the model is IGNORED for safety
        UserEntity currentUser = getCurrentUser();

        // map model → entity
        PostEntity postEntity = postMapper.toEntity(postModel);

        // set real authenticated author
        postEntity.setAuthor(currentUser);

        PostEntity savedPost = postRepository.save(postEntity);
        return postMapper.toModel(savedPost);
    }

    // ============================================================
    // Update Post
    // ============================================================
    public PostModel updatePost(Long postId, PostModel postModel) {

        postValidator.createOrUpdatePost(postModel);

        PostEntity existingPost =
                postRepository.findById(postId)
                        .orElseThrow(() -> new RuntimeException("Post not found"));

        // check permission
        ensureUserCanModifyPost(existingPost);

        // apply updates
        existingPost.setTitle(postModel.getTitle());
        existingPost.setContent(postModel.getContent());
        existingPost.setCategory(postModel.getCategory());

        PostEntity updated = postRepository.save(existingPost);
        return postMapper.toModel(updated);
    }

    // ============================================================
    // Delete Post
    // ============================================================
    public void deletePost(Long postId) {

        postValidator.deletePost(postId);

        PostEntity post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // check permission
        ensureUserCanModifyPost(post);

        postRepository.delete(post);
    }

    // ============================================================
    // Getters
    // ============================================================
    public PostModel getPostById(Long postId) {
        PostEntity post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        return postMapper.toModel(post);
    }

    public Page<PostModel> getPostsByAuthor(Long authorId, Pageable pageable) {
        return postRepository.findByAuthorId(authorId, pageable)
                .map(postMapper::toModel);
    }

    public Page<PostModel> getPostsByCategory(String category, Pageable pageable) {
        return postRepository.findByCategory(category, pageable)
                .map(postMapper::toModel);
    }

    public Page<PostModel> getAllPosts(Pageable pageable) {
        return postRepository.findAll(pageable)
                .map(postMapper::toModel);
    }

    public Page<PostModel> getMyPosts(Pageable pageable) {

        UserEntity currentUser = getCurrentUser();

        return postRepository
                .findByAuthorId(currentUser.getId(), pageable)
                .map(postMapper::toModel);
    }

    public long getMyPostCount() {
        UserEntity currentUser = getCurrentUser();
        return postRepository.countByAuthorId(currentUser.getId());
    }

    // ============================================================
    // Security Helpers
    // ============================================================

    private UserEntity getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("Unauthenticated");
        }

        String username = auth.getName();

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found in database"));
    }

    private void ensureUserCanModifyPost(PostEntity post) {

        UserEntity currentUser = getCurrentUser();

        Long currentId = currentUser.getId();
        Long authorId = post.getAuthor().getId();

        Set<Role> currentRoles = currentUser.getRoles();
        Set<Role> authorRoles = post.getAuthor().getRoles();

        // owner can edit own post
        if (currentId.equals(authorId)) {
            return;
        }

        // SUPERADMIN can edit anything
        if (currentRoles.contains(Role.SUPERADMIN)) {
            return;
        }

        // ADMIN can edit USER posts
        if (currentRoles.contains(Role.ADMIN) && authorRoles.contains(Role.USER)) {
            return;
        }

        throw new RuntimeException("You are not allowed to modify this post");
    }

}
