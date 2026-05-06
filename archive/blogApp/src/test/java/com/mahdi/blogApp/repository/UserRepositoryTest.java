package com.mahdi.blogApp.repository;

import com.mahdi.blogApp.entity.UserEntity;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@DataJpaTest
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    public void testSaveUser() {
        UserEntity userEntity = new UserEntity();
        userEntity.setUsername("testuser");
        userEntity.setPassword("testpassword");
        userEntity.setEmail("testemail@example.com");

        UserEntity savedUser = userRepository.save(userEntity);

        assertNotNull(savedUser.getId());
        assertEquals("testuser",savedUser.getUsername());

    }

    @Test
    public void testFindById(){
        UserEntity user = new UserEntity();
        user.setUsername("john");
        user.setEmail("john@example.com");
        user.setPassword("pass123");
        user = userRepository.save(user);

        Optional<UserEntity> userOptional = userRepository.findById(user.getId());
        assertNotNull(userOptional);
        assertEquals("john",userOptional.get().getUsername());
    }

    @Test
    public void testGetByUsername() {
        UserEntity user = new UserEntity();
        user.setUsername("alice");
        user.setEmail("alice@example.com");
        user.setPassword("pass123");
        userRepository.save(user);

        UserEntity found = userRepository.getByUsername("alice");
        assertNotNull(found);
        assertEquals("alice@example.com", found.getEmail());
    }
}
