package com.mahdi.blogApp.feature.category.mapper;

import com.mahdi.blogApp.feature.category.entity.CategoryEntity;
import com.mahdi.blogApp.feature.category.model.CategoryCreateRequest;
import com.mahdi.blogApp.feature.category.model.CategoryResponse;
import com.mahdi.blogApp.feature.category.model.CategoryUpdateRequest;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    CategoryEntity toEntity(CategoryCreateRequest request);

    CategoryResponse toResponse(CategoryEntity entity);

    void updateEntity(
            CategoryUpdateRequest request,
            @MappingTarget CategoryEntity entity
    );
}