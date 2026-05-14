package com.mahdi.blogApp.feature.post.service;

import com.mahdi.blogApp.feature.category.entity.CategoryEntity;
import com.mahdi.blogApp.feature.category.repository.CategoryRepository;
import com.mahdi.blogApp.feature.post.model.PostCreateRequest;
import com.mahdi.blogApp.feature.post.model.PostResponse;
import com.mahdi.blogApp.feature.post.model.PostUpdateRequest;
import com.mahdi.blogApp.feature.post.entity.PostEntity;
import com.mahdi.blogApp.feature.post.mapper.PostMapper;
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

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final PostMapper postMapper;
    private final PostValidator postValidator;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    public PostResponse createPost(PostCreateRequest request) {

        postValidator.createOrUpdatePost(request);

        UserEntity currentUser = getCurrentUser();

        Set<CategoryEntity> categories =
                new HashSet<>(categoryRepository.findAllById(request.getCategoryIds()));

        PostEntity postEntity = new PostEntity();
        postEntity.setTitle(request.getTitle());
        postEntity.setContent(request.getContent());
        postEntity.setCategories(categories);
        postEntity.setAuthor(currentUser);

        PostEntity savedPost = postRepository.save(postEntity);

        return postMapper.toResponse(savedPost);
    }

    public PostResponse updatePost(Long postId, PostUpdateRequest request) {

        postValidator.createOrUpdatePost(request);

        PostEntity existingPost =
                postRepository.findById(postId)
                        .orElseThrow(() -> new RuntimeException("Post not found"));

        ensureUserCanModifyPost(existingPost);

        Set<CategoryEntity> categories =
                new HashSet<>(categoryRepository.findAllById(request.getCategoryIds()));

        existingPost.setTitle(request.getTitle());
        existingPost.setContent(request.getContent());
        existingPost.setCategories(categories);

        PostEntity updated = postRepository.save(existingPost);

        return postMapper.toResponse(updated);
    }

    public void deletePost(Long postId) {

        postValidator.deletePost(postId);

        PostEntity post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        ensureUserCanModifyPost(post);

        postRepository.delete(post);
    }

    public PostResponse getPostById(Long postId) {

        PostEntity post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        return postMapper.toResponse(post);
    }

    public Page<PostResponse> getPostsByAuthor(Long authorId, Pageable pageable) {

        return postRepository
                .findByAuthorId(authorId, pageable)
                .map(postMapper::toResponse);
    }

    public Page<PostResponse> getPostsByCategory(String categoryName, Pageable pageable) {

        return postRepository
                .findByCategories_Name(categoryName, pageable)
                .map(postMapper::toResponse);
    }

    public Page<PostResponse> getAllPosts(Pageable pageable) {

        return postRepository
                .findAll(pageable)
                .map(postMapper::toResponse);
    }

    public Page<PostResponse> getMyPosts(Pageable pageable) {

        UserEntity currentUser = getCurrentUser();

        return postRepository
                .findByAuthorId(currentUser.getId(), pageable)
                .map(postMapper::toResponse);
    }

    public long getMyPostCount() {

        UserEntity currentUser = getCurrentUser();

        return postRepository.countByAuthorId(currentUser.getId());
    }

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

        if (currentId.equals(authorId)) {
            return;
        }

        if (currentRoles.contains(Role.SUPERADMIN)) {
            return;
        }

        if (currentRoles.contains(Role.ADMIN) && authorRoles.contains(Role.USER)) {
            return;
        }

        throw new RuntimeException("You are not allowed to modify this post");
    }
}
