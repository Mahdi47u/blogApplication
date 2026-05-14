package com.mahdi.blogApp.feature.category.service;

import com.mahdi.blogApp.feature.category.model.CategoryCreateRequest;
import com.mahdi.blogApp.feature.category.model.CategoryResponse;
import com.mahdi.blogApp.feature.category.model.CategoryUpdateRequest;
import com.mahdi.blogApp.feature.category.entity.CategoryEntity;
import com.mahdi.blogApp.feature.category.mapper.CategoryMapper;
import com.mahdi.blogApp.feature.category.repository.CategoryRepository;
import com.mahdi.blogApp.feature.category.validator.CategoryValidator;
import com.mahdi.blogApp.feature.user.entity.Role;
import com.mahdi.blogApp.feature.user.entity.UserEntity;
import com.mahdi.blogApp.feature.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    private final CategoryValidator categoryValidator;
    private final UserRepository userRepository;

    public CategoryResponse create(CategoryCreateRequest request) {

        ensureUserCanManageCategories();

        categoryValidator.validateCategoryName(request.name());

        CategoryEntity category = categoryMapper.toEntity(request);

        category.setSlug(generateSlug(request.name()));

        categoryValidator.validateCategorySlug(category.getSlug());

        CategoryEntity saved = categoryRepository.save(category);

        return categoryMapper.toResponse(saved);
    }

    public List<CategoryResponse> getAll() {

        return categoryRepository.findAll()
                .stream()
                .map(categoryMapper::toResponse)
                .toList();
    }

    public CategoryResponse getById(Long id) {

        CategoryEntity category = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Category not found"));

        return categoryMapper.toResponse(category);
    }


    public CategoryResponse update(Long id, CategoryUpdateRequest request) {

        ensureUserCanManageCategories();

        CategoryEntity category = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Category not found"));

        if (!category.getName().equals(request.name())) {
            categoryValidator.validateCategoryName(request.name());
        }

        categoryMapper.updateEntity(request, category);

        category.setSlug(generateSlug(request.name()));

        CategoryEntity updated = categoryRepository.save(category);

        return categoryMapper.toResponse(updated);
    }

    public void delete(Long id) {

        ensureUserCanManageCategories();

        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Category not found");
        }

        categoryRepository.deleteById(id);
    }


    private UserEntity getCurrentUser() {

        Authentication auth = SecurityContextHolder
                .getContext()
                .getAuthentication();

        if (auth == null
                || !auth.isAuthenticated()
                || auth.getPrincipal().equals("anonymousUser")) {

            throw new RuntimeException("Unauthenticated");
        }

        String username = auth.getName();

        return userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("User not found in database"));
    }

    private void ensureUserCanManageCategories() {

        UserEntity currentUser = getCurrentUser();

        Set<Role> roles = currentUser.getRoles();

        if (roles.contains(Role.ADMIN)
                || roles.contains(Role.SUPERADMIN)) {
            return;
        }

        throw new RuntimeException("You are not allowed to manage categories");
    }


    private String generateSlug(String value) {

        return value
                .trim()
                .toLowerCase()
                .replace(" ", "-");
    }
}
