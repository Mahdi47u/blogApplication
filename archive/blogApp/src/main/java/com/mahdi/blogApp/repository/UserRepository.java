package com.mahdi.blogApp.repository;

import com.mahdi.blogApp.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {


    UserEntity getByUsername(String username);

    Optional<UserEntity> findByUsername(String username);
}
