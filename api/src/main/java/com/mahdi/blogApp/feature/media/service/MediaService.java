package com.mahdi.blogApp.feature.media.service;

import com.mahdi.blogApp.feature.media.entity.MediaAssetEntity;
import com.mahdi.blogApp.feature.media.entity.MediaType;
import com.mahdi.blogApp.feature.media.mapper.MediaMapper;
import com.mahdi.blogApp.feature.media.model.MediaAssetResponse;
import com.mahdi.blogApp.feature.media.model.StoredObject;
import com.mahdi.blogApp.feature.media.repository.MediaAssetRepository;
import com.mahdi.blogApp.feature.media.validator.MediaValidator;
import com.mahdi.blogApp.feature.post.entity.PostEntity;
import com.mahdi.blogApp.feature.post.repository.PostRepository;
import com.mahdi.blogApp.feature.user.entity.Role;
import com.mahdi.blogApp.feature.user.entity.UserEntity;
import com.mahdi.blogApp.feature.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MediaService {

    private final MediaAssetRepository mediaAssetRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final MediaValidator mediaValidator;
    private final ObjectStorageService objectStorageService;
    private final MediaMapper mediaMapper;

    @Transactional
    public MediaAssetResponse uploadPostCover(Long postId, MultipartFile file) {

        mediaValidator.validateImage(file);

        UserEntity currentUser = getCurrentUser();
        PostEntity post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        ensureCanManagePostMedia(currentUser, post);
        deleteExistingPostCover(post);

        try {
            byte[] originalBytes = file.getBytes();
            String extension = resolveExtension(file.getOriginalFilename(), file.getContentType());
            String id = UUID.randomUUID().toString();
            ThumbnailData thumbnailData = createThumbnail(originalBytes, file.getContentType(), extension);

            String objectKey = "posts/covers/%d/%s%s".formatted(postId, id, extension);
            String thumbnailObjectKey = "posts/thumbnails/%d/%s%s".formatted(postId, id, thumbnailData.extension());

            StoredObject original = objectStorageService.upload(
                    objectKey,
                    new ByteArrayInputStream(originalBytes),
                    originalBytes.length,
                    file.getContentType()
            );

            StoredObject thumbnail = objectStorageService.upload(
                    thumbnailObjectKey,
                    new ByteArrayInputStream(thumbnailData.bytes()),
                    thumbnailData.bytes().length,
                    thumbnailData.contentType()
            );

            MediaAssetEntity mediaAsset = new MediaAssetEntity();
            mediaAsset.setBucket(original.getBucket());
            mediaAsset.setObjectKey(original.getObjectKey());
            mediaAsset.setPublicUrl(original.getPublicUrl());
            mediaAsset.setOriginalFileName(file.getOriginalFilename());
            mediaAsset.setContentType(file.getContentType());
            mediaAsset.setSize(file.getSize());
            mediaAsset.setMediaType(MediaType.POST_COVER);
            mediaAsset.setOwner(currentUser);
            mediaAsset.setPost(post);
            mediaAsset.setThumbnailObjectKey(thumbnail.getObjectKey());
            mediaAsset.setThumbnailUrl(thumbnail.getPublicUrl());

            MediaAssetEntity savedMedia = mediaAssetRepository.save(mediaAsset);

            post.setCoverImageUrl(savedMedia.getPublicUrl());
            post.setThumbnailUrl(savedMedia.getThumbnailUrl());
            postRepository.save(post);

            return mediaMapper.toResponse(savedMedia);
        } catch (Exception e) {
            throw new RuntimeException("Failed to process post cover image", e);
        }
    }

    @Transactional
    public void deletePostCover(Long postId) {

        UserEntity currentUser = getCurrentUser();
        PostEntity post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        ensureCanManagePostMedia(currentUser, post);
        deleteExistingPostCover(post);
    }

    private void deleteExistingPostCover(PostEntity post) {

        mediaAssetRepository
                .findTopByPostIdAndMediaTypeOrderByCreatedAtDesc(post.getId(), MediaType.POST_COVER)
                .ifPresent(mediaAsset -> {
                    objectStorageService.delete(mediaAsset.getObjectKey());
                    objectStorageService.delete(mediaAsset.getThumbnailObjectKey());
                    mediaAssetRepository.delete(mediaAsset);
                });

        post.setCoverImageUrl(null);
        post.setThumbnailUrl(null);
        postRepository.save(post);
    }

    private ThumbnailData createThumbnail(byte[] originalBytes, String originalContentType, String originalExtension) {
        try {
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

            Thumbnails.of(new ByteArrayInputStream(originalBytes))
                    .width(480)
                    .outputFormat("jpg")
                    .toOutputStream(outputStream);

            return new ThumbnailData(outputStream.toByteArray(), "image/jpeg", ".jpg");
        } catch (Exception e) {
            return new ThumbnailData(originalBytes, originalContentType, originalExtension);
        }
    }

    private String resolveExtension(String originalFileName, String contentType) {

        if (originalFileName != null && originalFileName.contains(".")) {
            String extension = originalFileName.substring(originalFileName.lastIndexOf("."));
            return extension.toLowerCase(Locale.ROOT);
        }

        return switch (contentType) {
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            default -> ".jpg";
        };
    }

    private void ensureCanManagePostMedia(UserEntity currentUser, PostEntity post) {

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

        if (
                currentRoles.contains(Role.ADMIN) &&
                authorRoles.contains(Role.USER) &&
                !authorRoles.contains(Role.ADMIN) &&
                !authorRoles.contains(Role.SUPERADMIN)
        ) {
            return;
        }

        throw new RuntimeException("You are not allowed to manage this post media");
    }

    private UserEntity getCurrentUser() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("Unauthenticated");
        }

        return userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("Current user not found"));
    }

    private record ThumbnailData(byte[] bytes, String contentType, String extension) {
    }
}
