package com.mahdi.blogApp.feature.user.service;

import com.mahdi.blogApp.feature.user.entity.Role;
import com.mahdi.blogApp.feature.user.mapper.UserMapper;
import com.mahdi.blogApp.feature.user.model.ChangePasswordRequest;
import com.mahdi.blogApp.feature.user.model.ProfileResponse;
import com.mahdi.blogApp.feature.user.model.PublicProfileResponse;
import com.mahdi.blogApp.feature.user.model.UserModel;
import com.mahdi.blogApp.feature.user.repository.UserRepository;
import com.mahdi.blogApp.feature.user.validator.UserValidator;
import com.mahdi.blogApp.feature.user.entity.UserEntity;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserManagementService {

    private final UserRepository userRepository;
    private final UserValidator userValidator;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserModel createUser(UserModel userModel) {
        userValidator.createOrUpdateUser(userModel);

        UserEntity user = userMapper.toEntity(userModel);

        // encode password
        user.setPassword(passwordEncoder.encode(userModel.getPassword()));

        // assign default role if none provided
        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            user.getRoles().add(Role.USER);
        }

        user.setEnabled(true);

        return userMapper.toModel(userRepository.save(user));
    }

    public List<UserModel> getAllUsers() {
        return userMapper.toUserModelList(userRepository.findAll());
    }

    public Optional<UserModel> getUserById(Long id) {
//        UserEntity user = userRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//        return userMapper.toModel(user);
        return userRepository.findById(id)
                .map(userMapper::toModel);
    }

    public Optional<UserModel> getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .map(userMapper::toModel);
    }

    public ProfileResponse getProfileByUsername(String username) {
        return userRepository.findByUsername(username)
                .map(userMapper::toProfileResponse)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public PublicProfileResponse getPublicProfileById(Long id) {
        return userRepository.findById(id)
                .map(userMapper::toPublicProfileResponse)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Transactional
    public UserModel updateUser(UserModel userModel, Long id) {
        userValidator.createOrUpdateUser(userModel);

        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setUsername(userModel.getUsername());
        user.setEmail(userModel.getEmail());

        // only update password if provided
        if (userModel.getPassword() != null && !userModel.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(userModel.getPassword()));
        }

        // update roles only if provided — admins will control this
        if (userModel.getRoles() != null && !userModel.getRoles().isEmpty()) {
            user.setRoles(userModel.getRoles());
        }

        return userMapper.toModel(userRepository.save(user));
    }

    public void deleteUser(Long id) {
        userValidator.deleteUser(id);
        userRepository.deleteById(id);
    }

    public void deleteUserByUsername(String username) {
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        userRepository.delete(user);
    }

    public UserModel updateUserRole(Long id, Role role) {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Replace roles with new role
        user.setRoles(Set.of(role));

        return userMapper.toModel(userRepository.save(user));
    }

    @Transactional
    public void changePassword(String username, ChangePasswordRequest request) {

        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Validate old password
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }

        // Validate new password (optional: length, format)
        if (request.getNewPassword() == null || request.getNewPassword().length() < 6) {
            throw new RuntimeException("New password must be at least 6 characters");
        }

        // Encode and update new password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        userRepository.save(user);
    }

    @Transactional
    public ProfileResponse updateBio(String username, String bio) {

        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setBio(bio);

        return userMapper.toProfileResponse(userRepository.save(user));
    }


    @Transactional
    public ProfileResponse updateProfilePictureUrl(String username, String imageUrl) {

        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setProfilePicture(imageUrl);

        return userMapper.toProfileResponse(userRepository.save(user));
    }


    @Transactional
    public UserModel updateProfilePicture(String username, MultipartFile file) {

        userValidator.validateProfilePicture(file);

        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String uploadDir = "uploads/profile/";

        File directory = new File(uploadDir);
        if (!directory.exists()) directory.mkdirs();

        String extension = Objects.requireNonNull(file.getOriginalFilename())
                .substring(file.getOriginalFilename().lastIndexOf("."));

        String fileName = username + "_" + System.currentTimeMillis() + extension;

        Path filePath = Paths.get(uploadDir + fileName);

        try {
            Files.write(filePath, file.getBytes());
        } catch (IOException e) {
            throw new RuntimeException("Failed to save profile picture");
        }

        user.setProfilePicture("/uploads/profile/" + fileName);

        return userMapper.toModel(userRepository.save(user));
    }


}

