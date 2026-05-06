package com.mahdi.blogApp.mapper;

import com.mahdi.blogApp.entity.CommentEntity;
import com.mahdi.blogApp.model.CommentModel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;
import java.util.Optional;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CommentMapper {

    @Mapping(source = "postId", target = "post.id")
    @Mapping(source = "authorId", target = "author.id")
    CommentEntity toEntity(CommentModel commentModel);

    @Mapping(source = "post.id", target = "postId")
    @Mapping(source = "author.id", target = "authorId")
    CommentModel toModel(CommentEntity commentEntity);

    List<CommentModel> toModelList(List<CommentEntity> commentEntities);

}
