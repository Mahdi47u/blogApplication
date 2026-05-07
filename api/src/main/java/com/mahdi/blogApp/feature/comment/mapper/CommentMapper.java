package com.mahdi.blogApp.feature.comment.mapper;

import com.mahdi.blogApp.feature.comment.entity.CommentEntity;
import com.mahdi.blogApp.feature.comment.model.CommentModel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CommentMapper {

    @Mapping(target = "id", source = "id")
    @Mapping(target = "text", source = "text")
    @Mapping(target = "createdAt", source = "createdAt")
    @Mapping(target = "author", source = "user.username")
    @Mapping(target = "likeCount", source = "likeCount")
    @Mapping(target = "edited", source = "edited")
    CommentModel toModel(CommentEntity commentEntity);
}
