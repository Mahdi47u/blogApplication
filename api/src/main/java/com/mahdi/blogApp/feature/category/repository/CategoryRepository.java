package com.mahdi.blogApp.feature.category.repository;


import com.mahdi.blogApp.feature.category.entity.CategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoryRepository extends JpaRepository<CategoryEntity, Long> {

    boolean existsByName(String name);

    boolean existsBySlug(String slug);

    Optional<CategoryEntity> findBySlug(String slug);
}