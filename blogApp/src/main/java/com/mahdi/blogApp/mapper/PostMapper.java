package com.mahdi.blogApp.mapper;

import com.mahdi.blogApp.entity.PostEntity;
import com.mahdi.blogApp.entity.UserEntity;
import com.mahdi.blogApp.model.PostModel;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PostMapper {

    // From Model to Entity
    @Mapping(target = "author", expression = "java(mapAuthor(postModel.getAuthorId()))")
    PostEntity toEntity(PostModel postModel);

    // From Entity to Model
    @Mapping(source = "author.id", target = "authorId")
    PostModel toModel(PostEntity postEntity);

    List<PostModel> toModelList(List<PostEntity> postEntities);

    // Helper method to create a lightweight UserEntity
    default UserEntity mapAuthor(Long authorId) {
        if (authorId == null) return null;
        UserEntity user = new UserEntity();
        user.setId(authorId);
        return user;
    }
}
