package com.mahdi.blogApp.feature.media.repository;

import com.mahdi.blogApp.feature.media.entity.MediaAssetEntity;
import com.mahdi.blogApp.feature.media.entity.MediaType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MediaAssetRepository extends JpaRepository<MediaAssetEntity, Long> {

    Optional<MediaAssetEntity> findTopByPostIdAndMediaTypeOrderByCreatedAtDesc(Long postId, MediaType mediaType);
}
