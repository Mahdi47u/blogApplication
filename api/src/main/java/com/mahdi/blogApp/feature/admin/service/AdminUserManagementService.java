package com.mahdi.blogApp.feature.admin.service;

import com.mahdi.blogApp.feature.user.entity.Role;
import com.mahdi.blogApp.feature.user.entity.UserEntity;
import com.mahdi.blogApp.feature.user.mapper.UserMapper;
import com.mahdi.blogApp.feature.user.model.UserModel;
import com.mahdi.blogApp.feature.user.repository.UserRepository;
import com.mahdi.blogApp.feature.user.service.UserManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AdminUserManagementService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final UserManagementService userManagementService;

    @Transactional
    public UserModel createAdmin(UserModel userModel) {

        UserEntity currentUser = getCurrentUser();

        if (!currentUser.getRoles().contains(Role.SUPERADMIN)) {
            throw new RuntimeException("Only SUPERADMIN can create admins");
        }

        userModel.setRoles(Set.of(Role.ADMIN));

        return userManagementService.createUser(userModel);
    }

    @Transactional(readOnly = true)
    public List<UserModel> getAllUsers() {

        return userMapper.toUserModelList(userRepository.findAll());
    }

    @Transactional(readOnly = true)
    public UserModel getUserById(Long id) {

        return userRepository.findById(id)
                .map(userMapper::toModel)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Transactional
    public UserModel updateUserRole(Long userId, Role newRole) {

        if (newRole == null) {
            throw new RuntimeException("Role is required");
        }

        UserEntity currentUser = getCurrentUser();
        UserEntity targetUser = getTargetUser(userId);

        ensureCanManageUser(currentUser, targetUser);
        ensureCanAssignRole(currentUser, newRole);
        ensureNotRemovingLastSuperAdmin(targetUser, newRole);

        targetUser.setRoles(Set.of(newRole));

        return userMapper.toModel(userRepository.save(targetUser));
    }

    @Transactional
    public void deleteUser(Long userId) {

        UserEntity currentUser = getCurrentUser();
        UserEntity targetUser = getTargetUser(userId);

        if (currentUser.getId().equals(targetUser.getId())) {
            throw new RuntimeException("You cannot delete your own account");
        }

        ensureCanManageUser(currentUser, targetUser);
        ensureNotDeletingLastSuperAdmin(targetUser);

        userRepository.delete(targetUser);
    }

    private void ensureCanManageUser(UserEntity currentUser, UserEntity targetUser) {

        if (currentUser.getRoles().contains(Role.SUPERADMIN)) {
            return;
        }

        if (
                currentUser.getRoles().contains(Role.ADMIN) &&
                targetUser.getRoles().contains(Role.USER) &&
                !targetUser.getRoles().contains(Role.ADMIN) &&
                !targetUser.getRoles().contains(Role.SUPERADMIN)
        ) {
            return;
        }

        throw new RuntimeException("You are not allowed to manage this user");
    }

    private void ensureCanAssignRole(UserEntity currentUser, Role newRole) {

        if (currentUser.getRoles().contains(Role.SUPERADMIN)) {
            return;
        }

        if (newRole == Role.USER) {
            return;
        }

        throw new RuntimeException("Only SUPERADMIN can assign admin roles");
    }

    private void ensureNotDeletingLastSuperAdmin(UserEntity targetUser) {

        if (
                targetUser.getRoles().contains(Role.SUPERADMIN) &&
                userRepository.countByRolesContaining(Role.SUPERADMIN) <= 1
        ) {
            throw new RuntimeException("You cannot delete the last SUPERADMIN");
        }
    }

    private void ensureNotRemovingLastSuperAdmin(UserEntity targetUser, Role newRole) {

        if (
                targetUser.getRoles().contains(Role.SUPERADMIN) &&
                newRole != Role.SUPERADMIN &&
                userRepository.countByRolesContaining(Role.SUPERADMIN) <= 1
        ) {
            throw new RuntimeException("You cannot remove the last SUPERADMIN role");
        }
    }

    private UserEntity getCurrentUser() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("Unauthenticated");
        }

        return userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("Current user not found"));
    }

    private UserEntity getTargetUser(Long userId) {

        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
