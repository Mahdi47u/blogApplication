package com.mahdi.blogApp.service;


import com.mahdi.blogApp.entity.CommentEntity;
import com.mahdi.blogApp.entity.PostEntity;
import com.mahdi.blogApp.entity.UserEntity;
import com.mahdi.blogApp.mapper.CommentMapper;
import com.mahdi.blogApp.model.CommentModel;
import com.mahdi.blogApp.repository.CommentRepository;
import com.mahdi.blogApp.repository.PostRepository;
import com.mahdi.blogApp.repository.UserRepository;
import com.mahdi.blogApp.validator.CommentValidator;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final CommentMapper commentMapper;
    private final CommentValidator commentValidator;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Transactional
    public CommentModel createComment(CommentModel commentModel) {
        commentValidator.validateCreateComment(commentModel);

        PostEntity post = postRepository.findById(commentModel.getPostId())
                .orElseThrow(() -> new RuntimeException("the post doesnt exists"));

        UserEntity author = userRepository.findById(commentModel.getAuthorId())
                .orElseThrow(() -> new RuntimeException("Author not found"));

        CommentEntity commentEntity = commentMapper.toEntity(commentModel);

        commentEntity.assignPost(post);
        commentEntity.assignAuthor(author);
        commentEntity.setApproved(false);

        commentEntity = commentRepository.save(commentEntity);

        return commentMapper.toModel(commentEntity);
    }

    @Transactional
    public CommentModel approveComment(Long commentId, Long adminId) {
        userRepository.findById(adminId).orElseThrow(() -> new RuntimeException("Admin not found"));

        commentValidator.validateApproveComment(commentId);

        CommentEntity comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("the comment doesnt exists"));

        comment.setApproved(true);
        CommentEntity SavedComment = commentRepository.save(comment);
        return commentMapper.toModel(SavedComment);
    }

    @Transactional
    public void deleteComment(Long commentId) {
        CommentEntity comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("the comment doesnt exists"));
        CommentModel commentModel = commentMapper.toModel(comment);
        commentValidator.validateDeleteComment(commentModel);
        commentRepository.deleteById(commentId);
    }

//    @Transactional
//    public List<CommentModel> getCommentsByPostId(Long postId) {
//        Optional<CommentEntity> comment = commentRepository.findById(postId);
//        return commentMapper.toModelList(comment);
//    }
}
