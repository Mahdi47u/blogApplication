package com.mahdi.blogApp.feature.comment.mapper;

import com.mahdi.blogApp.feature.comment.entity.CommentEntity;
import com.mahdi.blogApp.feature.comment.model.CommentModel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CommentMapper {

    @Mapping(target = "authorId", source = "user.username")
    @Mapping(target = "parentId", source = "parent.id")
    CommentModel toModel(CommentEntity commentEntity);
}
