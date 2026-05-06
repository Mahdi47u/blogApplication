package com.mahdi.blogApp.feature.user.validator;

import com.mahdi.blogApp.feature.user.model.UserModel;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class UserValidator {

    public void createOrUpdateUser(UserModel userModel) {
        if(userModel.getEmail() == null || userModel.getEmail().trim().equals("")) {
            throw new IllegalArgumentException("Email is required");
        }
        if(userModel.getPassword() == null || userModel.getPassword().trim().equals("")) {
            throw new IllegalArgumentException("Password is required");
        }
        if(userModel.getPassword().length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters");
        }
        if(userModel.getUsername() == null || userModel.getUsername().trim().equals("")) {
            throw new IllegalArgumentException("Username is required");
        }
    }
    public void deleteUser(Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID is required to delete user");
        }
    }

    public void validateProfilePicture(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Uploaded file is empty");
        }

        String contentType = file.getContentType();

        if (contentType == null ||
                !(contentType.equals("image/png") ||
                        contentType.equals("image/jpeg") ||
                        contentType.equals("image/jpg") ||
                        contentType.equals("image/webp"))) {

            throw new IllegalArgumentException(
                    "Invalid file type. Only PNG, JPG, JPEG, WEBP allowed"
            );
        }

        // Optional size limit (5MB)
        long maxSize = 5 * 1024 * 1024;
        if (file.getSize() > maxSize) {
            throw new IllegalArgumentException("File size must be less than 5MB");
        }
    }

}
