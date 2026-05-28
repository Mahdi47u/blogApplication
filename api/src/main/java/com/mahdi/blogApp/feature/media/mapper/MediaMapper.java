package com.mahdi.blogApp.feature.media.mapper;

import com.mahdi.blogApp.feature.media.entity.MediaAssetEntity;
import com.mahdi.blogApp.feature.media.model.MediaAssetResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface MediaMapper {

    @Mapping(source = "owner.id", target = "ownerId")
    @Mapping(source = "post.id", target = "postId")
    MediaAssetResponse toResponse(MediaAssetEntity entity);
}
