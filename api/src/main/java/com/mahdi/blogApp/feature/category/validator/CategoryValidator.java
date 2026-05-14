package com.mahdi.blogApp.feature.category.validator;

import com.mahdi.blogApp.feature.category.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CategoryValidator {

    private final CategoryRepository categoryRepository;

    public void validateCategoryName(String name) {

        if (categoryRepository.existsByName(name)) {
            throw new IllegalArgumentException(
                    "Category name already exists"
            );
        }
    }

    public void validateCategorySlug(String slug) {

        if (categoryRepository.existsBySlug(slug)) {
            throw new IllegalArgumentException(
                    "Category slug already exists"
            );
        }
    }
}
