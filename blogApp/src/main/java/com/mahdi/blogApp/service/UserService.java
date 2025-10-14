package com.mahdi.blogApp.service;


import com.mahdi.blogApp.entity.UserEntity;
import com.mahdi.blogApp.mapper.UserMapper;
import com.mahdi.blogApp.model.UserModel;
import com.mahdi.blogApp.repository.UserRepository;
import com.mahdi.blogApp.validator.UserValidator;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final UserValidator userValidator;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserModel createUser(UserModel userModel) {
        userValidator.createOrUpdateUser(userModel);
        UserEntity user = userMapper.toEntity(userModel);
        user.setPassword(passwordEncoder.encode(userModel.getPassword()));
        Set<String> roles = new HashSet<>();
        roles.add("USER");
        user.setRoles(roles);

        user = userRepository.save(user);
        return userMapper.toModel(user);
    }

    // i have some doubt in here !!!
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserModel> getAllUsers() {
        return userMapper.toUserModelList(userRepository.findAll());
    }

    @PreAuthorize("hasRole('USER')")
    public UserModel getUserById(Long id) {
        UserEntity user = userRepository.findById(id).orElseThrow(
                () -> new RuntimeException("User with id " + id + " not found")
        );
        return userMapper.toModel(user);
    }

    @PreAuthorize("hasRole('USER')")
    public UserModel getUserByUsername(String username) {
        UserEntity user = userRepository.getByUsername(username);
        return userMapper.toModel(user);
    }

    @Transactional
    @PreAuthorize("hasRole('USER')")
    public UserModel updateUser(UserModel userModel, Long id) {
        userValidator.createOrUpdateUser(userModel);
        UserEntity user = userRepository.findById(id).orElseThrow(
                () -> new RuntimeException("User with id " + id + " not found")
        );
        user.setUsername(userModel.getUsername());
        if (userModel.getPassword() != null && !userModel.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userModel.getPassword()));
        }
        user = userRepository.save(user);
        return userMapper.toModel(user);
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(Long id) {
        userValidator.deleteUser(id);
        userRepository.deleteById(id);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User with username " + username + " not found"));

    }
}
