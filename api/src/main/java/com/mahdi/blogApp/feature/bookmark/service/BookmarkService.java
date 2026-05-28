package com.mahdi.blogApp.feature.bookmark.service;

import com.mahdi.blogApp.feature.bookmark.entity.BookmarkEntity;
import com.mahdi.blogApp.feature.bookmark.mapper.BookmarkMapper;
import com.mahdi.blogApp.feature.bookmark.model.BookmarkResponse;
import com.mahdi.blogApp.feature.bookmark.repository.BookmarkRepository;
import com.mahdi.blogApp.feature.post.entity.PostEntity;
import com.mahdi.blogApp.feature.post.repository.PostRepository;
import com.mahdi.blogApp.feature.user.entity.UserEntity;
import com.mahdi.blogApp.feature.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BookmarkService {

    private final BookmarkRepository bookmarkRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final BookmarkMapper bookmarkMapper;

    public void savePost(Long postId, Long userId) {

        boolean alreadySaved =
                bookmarkRepository.existsByUserIdAndPostId(userId, postId);

        if (alreadySaved) {
            return;
        }

        PostEntity post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        BookmarkEntity bookmark = new BookmarkEntity();
        bookmark.setPost(post);
        bookmark.setUser(user);

        bookmarkRepository.save(bookmark);
    }

    public void unsavePost(Long postId, Long userId) {

        boolean alreadySaved =
                bookmarkRepository.existsByUserIdAndPostId(userId, postId);

        if (!alreadySaved) {
            return;
        }

        bookmarkRepository.deleteByUserIdAndPostId(userId, postId);
    }

    public boolean isSavedByUser(Long postId, Long userId) {

        return bookmarkRepository.existsByUserIdAndPostId(userId, postId);
    }

    public Page<BookmarkResponse> getSavedPosts(Long userId, Pageable pageable) {

        return bookmarkRepository
                .findByUserId(userId, pageable)
                .map(bookmarkMapper::toResponse);
    }

    public long getSavedPostCount(Long userId) {

        return bookmarkRepository.countByUserId(userId);
    }
}
