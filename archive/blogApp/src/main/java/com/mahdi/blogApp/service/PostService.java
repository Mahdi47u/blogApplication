package com.mahdi.blogApp.service;

import com.mahdi.blogApp.entity.PostEntity;
import com.mahdi.blogApp.entity.UserEntity;
import com.mahdi.blogApp.mapper.PostMapper;
import com.mahdi.blogApp.model.PostModel;
import com.mahdi.blogApp.repository.PostRepository;
import com.mahdi.blogApp.repository.UserRepository;
import com.mahdi.blogApp.validator.PostValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class PostService {


    private final PostRepository postRepository;
    private final PostMapper postMapper;
    private final PostValidator postValidator;
    private final UserRepository userRepository;

    public PostModel createPost(PostModel postModel) {

        postValidator.createOrUpdatePost(postModel);

        UserEntity author = userRepository.findById(postModel.getAuthorId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        PostEntity postEntity = postMapper.toEntity(postModel);
        postEntity.setAuthor(author);


        postEntity = postRepository.save(postEntity);
        return postMapper.toModel(postEntity);
    }

    public PostModel updatePost(PostModel postModel, Long postId) {
        postValidator.createOrUpdatePost(postModel);
        PostEntity postEntity = postRepository.findById(postId).orElseThrow(
                () -> new RuntimeException("Post not found")
        );
        postEntity.setContent(postModel.getContent());
        postEntity.setTitle(postModel.getTitle());
        postEntity.setCategory(postModel.getCategory());
        postEntity = postRepository.save(postEntity);
        return postMapper.toModel(postEntity);
    }

    public void deletePost(Long id) {
        postValidator.deletePost(id);
        postRepository.deleteById(id);
    }
    public void deletePostByTitle(String title) {
        postRepository.deleteByTitle(title);
    }

    public PostModel getPostById(Long id) {
        PostEntity post = postRepository.findById(id).orElseThrow(
                () -> new RuntimeException("Post not found")
        );
        return postMapper.toModel(post);
    }

    public PostModel getPostByTitle(String title) {
        PostEntity post = postRepository.findByTitle(title)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        return postMapper.toModel(post);
    }

    public List<PostModel> getPostsByAuthor(Long authorId) {
        List<PostEntity> posts = postRepository.findByAuthorId(authorId);
        return postMapper.toModelList(posts);
    }

    public List<PostModel> getAllPosts() {
        return postMapper.toModelList(postRepository.findAll());
    }

    public List<PostModel> getPostsByCategory(String category) {
        List<PostEntity> posts = postRepository.findByCategory(category);
        return postMapper.toModelList(posts);
    }

}
