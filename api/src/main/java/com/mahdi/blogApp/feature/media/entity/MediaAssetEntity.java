package com.mahdi.blogApp.feature.media.entity;

import com.mahdi.blogApp.feature.BaseEntity;
import com.mahdi.blogApp.feature.post.entity.PostEntity;
import com.mahdi.blogApp.feature.user.entity.UserEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "media_assets")
public class MediaAssetEntity extends BaseEntity {

    @Column(nullable = false)
    private String bucket;

    @Column(nullable = false, unique = true)
    private String objectKey;

    @Column(nullable = false)
    private String publicUrl;

    @Column(nullable = false)
    private String originalFileName;

    @Column(nullable = false)
    private String contentType;

    @Column(nullable = false)
    private Long size;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MediaType mediaType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private UserEntity owner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    private PostEntity post;

    private String thumbnailObjectKey;

    private String thumbnailUrl;
}
