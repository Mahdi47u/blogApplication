package com.mahdi.blogApp.feature.category.model;


public record CategoryResponse(

        Long id,
        String name,
        String description,
        String slug
) {
}