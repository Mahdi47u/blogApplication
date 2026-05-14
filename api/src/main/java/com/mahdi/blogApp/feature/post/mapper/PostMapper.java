package com.mahdi.blogApp.feature.post.mapper;

import com.mahdi.blogApp.feature.category.entity.CategoryEntity;
import com.mahdi.blogApp.feature.post.model.PostResponse;
import com.mahdi.blogApp.feature.post.entity.PostEntity;
import org.mapstruct.*;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PostMapper {

    @Mapping(source = "author.id", target = "authorId")
    @Mapping(target = "categories", expression = "java(mapCategoryNames(postEntity.getCategories()))")
    PostResponse toResponse(PostEntity postEntity);

    default Set<String> mapCategoryNames(Set<CategoryEntity> categories) {

        if (categories == null) {
            return null;
        }

        return categories
                .stream()
                .map(CategoryEntity::getName)
                .collect(Collectors.toSet());
    }
}
