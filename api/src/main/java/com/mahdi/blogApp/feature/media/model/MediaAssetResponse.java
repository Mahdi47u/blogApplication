package com.mahdi.blogApp.feature.media.model;

import com.mahdi.blogApp.feature.media.entity.MediaType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MediaAssetResponse {

    private Long id;

    private String publicUrl;

    private String thumbnailUrl;

    private String originalFileName;

    private String contentType;

    private Long size;

    private MediaType mediaType;

    private Long ownerId;

    private Long postId;

    private LocalDateTime createdAt;
}
