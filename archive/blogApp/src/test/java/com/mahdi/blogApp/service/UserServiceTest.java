package com.mahdi.blogApp.service;


import com.mahdi.blogApp.entity.UserEntity;
import com.mahdi.blogApp.mapper.UserMapper;
import com.mahdi.blogApp.model.UserModel;
import com.mahdi.blogApp.repository.UserRepository;
import com.mahdi.blogApp.validator.UserValidator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserValidator userValidator;

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private UserService userService; // Remove final keyword in test

    @Test
    void testCreateUser() {
        UserModel model = new UserModel();
        model.setUsername("john");
        model.setEmail("john@example.com");
        model.setPassword("password123");

        UserEntity entity = new UserEntity();
        entity.setUsername("john");
        entity.setEmail("john@example.com");
        entity.setPassword("password123");

        when(userMapper.toEntity(model)).thenReturn(entity);
        when(userRepository.save(entity)).thenReturn(entity);
        when(userMapper.toModel(entity)).thenReturn(model);

        UserModel result = userService.createUser(model);

        assertNotNull(result); // <- this fixes NPE
        assertEquals("john", result.getUsername());
        verify(userValidator).createOrUpdateUser(model);
        verify(userRepository).save(entity);
    }
}
