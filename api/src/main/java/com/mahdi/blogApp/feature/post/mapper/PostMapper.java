package com.mahdi.blogApp.feature.post.mapper;

import com.mahdi.blogApp.feature.post.entity.PostEntity;
import com.mahdi.blogApp.feature.post.model.PostModel;
import com.mahdi.blogApp.feature.user.entity.UserEntity;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PostMapper {

//    @Mapping(target = "author", expression = "java(mapAuthor(postModel.getAuthorId()))")
    @Mapping(target = "author", ignore = true)
    PostEntity toEntity(PostModel postModel);

    @Mapping(source = "author.id", target = "authorId")
    PostModel toModel(PostEntity postEntity);

    List<PostModel> toModelList(List<PostEntity> postEntities);

//    default UserEntity mapAuthor(Long authorId) {
//        if (authorId == null) return null;
//        UserEntity user = new UserEntity();
//        user.setId(authorId);
//        return user;
//    }
}
