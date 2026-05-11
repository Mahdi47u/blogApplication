package com.mahdi.blogApp.feature.comment.service;

import com.mahdi.blogApp.feature.comment.model.dto.CommentCreateRequest;
import com.mahdi.blogApp.feature.comment.model.dto.CommentUpdateRequest;
import com.mahdi.blogApp.feature.comment.entity.CommentEntity;
import com.mahdi.blogApp.feature.comment.mapper.CommentMapper;
import com.mahdi.blogApp.feature.comment.model.CommentModel;
import com.mahdi.blogApp.feature.comment.repository.CommentRepository;
import com.mahdi.blogApp.feature.post.entity.PostEntity;
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

import java.util.Set;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CommentMapper commentMapper;


    public CommentModel createComment(CommentCreateRequest request) {

        UserEntity currentUser = getCurrentUser();

        PostEntity post = postRepository.findById(request.getPostId())
                .orElseThrow(() -> new RuntimeException("Post not found"));

        CommentEntity parent = null;

        if (request.getParentId() != null) {

            parent = commentRepository.findById(request.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent comment not found"));

            if (!parent.getPost().getId().equals(post.getId())) {
                throw new RuntimeException("Parent comment does not belong to this post");
            }
        }

        CommentEntity comment = new CommentEntity();

        comment.setText(request.getText());
        comment.setUser(currentUser);
        comment.setPost(post);
        comment.setParent(parent);
        comment.setLikeCount(0);
        comment.setApproved(true);
        comment.setEdited(false);

        CommentEntity saved = commentRepository.save(comment);

        return commentMapper.toModel(saved);
    }


    public CommentModel updateComment(Long commentId, CommentUpdateRequest request) {

        CommentEntity comment = commentRepository
                .findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        ensureUserCanModifyComment(comment);

        comment.setText(request.getText());
        comment.setEdited(true);

        CommentEntity updated = commentRepository.save(comment);

        return commentMapper.toModel(updated);
    }


    public void deleteComment(Long commentId) {

        CommentEntity comment = commentRepository
                .findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        ensureUserCanModifyComment(comment);

        commentRepository.delete(comment);
    }

    public Page<CommentModel> getRootComments(
            Long postId,
            Pageable pageable
    ) {

        return commentRepository
                .findRootCommentsWithUser(postId, pageable)
                .map(commentMapper::toModel);
    }

    public Page<CommentModel> getReplies(
            Long parentId,
            Pageable pageable
    ) {

        return commentRepository
                .findRepliesWithUser(parentId, pageable)
                .map(commentMapper::toModel);
    }

    // ============================================================
    // Security Helpers
    // ============================================================

    private UserEntity getCurrentUser() {

        Authentication auth = SecurityContextHolder
                .getContext()
                .getAuthentication();

        if (auth == null
                || !auth.isAuthenticated()
                || auth.getPrincipal().equals("anonymousUser")) {

            throw new RuntimeException("Unauthenticated");
        }

        String username = auth.getName();

        return userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("User not found in database"));
    }

    private void ensureUserCanModifyComment(CommentEntity comment) {

        UserEntity currentUser = getCurrentUser();

        Long currentId = currentUser.getId();
        Long authorId = comment.getUser().getId();

        Set<Role> currentRoles = currentUser.getRoles();
        Set<Role> authorRoles = comment.getUser().getRoles();

        // Owner can modify own comment
        if (currentId.equals(authorId)) {
            return;
        }

        // SUPERADMIN can modify anything
        if (currentRoles.contains(Role.SUPERADMIN)) {
            return;
        }

        // ADMIN can modify USER comments
        if (currentRoles.contains(Role.ADMIN)
                && authorRoles.contains(Role.USER)) {
            return;
        }

        throw new RuntimeException("You are not allowed to modify this comment");
    }

}
