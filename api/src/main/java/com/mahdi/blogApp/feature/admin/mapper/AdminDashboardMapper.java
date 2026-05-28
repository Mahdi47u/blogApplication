package com.mahdi.blogApp.feature.admin.mapper;

import com.mahdi.blogApp.feature.admin.model.AdminRecentPostResponse;
import com.mahdi.blogApp.feature.admin.model.AdminRecentUserResponse;
import com.mahdi.blogApp.feature.category.entity.CategoryEntity;
import com.mahdi.blogApp.feature.post.entity.PostEntity;
import com.mahdi.blogApp.feature.user.entity.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface AdminDashboardMapper {

    AdminRecentUserResponse toRecentUser(UserEntity user);

    @Mapping(source = "author.id", target = "authorId")
    @Mapping(source = "author.username", target = "authorName")
    @Mapping(target = "categories", expression = "java(mapCategoryNames(post.getCategories()))")
    AdminRecentPostResponse toRecentPost(PostEntity post);

    default Set<String> mapCategoryNames(Set<CategoryEntity> categories) {

        if (categories == null) {
            return Set.of();
        }

        return categories
                .stream()
                .map(CategoryEntity::getName)
                .collect(Collectors.toSet());
    }
}
