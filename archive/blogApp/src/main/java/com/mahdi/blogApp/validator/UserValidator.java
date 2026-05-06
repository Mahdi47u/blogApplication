package com.mahdi.blogApp.validator;


import com.mahdi.blogApp.mapper.UserMapper;
import com.mahdi.blogApp.model.UserModel;
import org.springframework.stereotype.Component;

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

}
