package com.mahdi.blogApp.controller;


import com.mahdi.blogApp.model.UserModel;
import com.mahdi.blogApp.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/user/")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/add")
    public ResponseEntity<UserModel> createUser(@RequestBody UserModel user) {
        UserModel createdUser = userService.createUser(user);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    @GetMapping("/all")
    public ResponseEntity<List<UserModel>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<UserModel> getUserById(@PathVariable String id) throws Exception {
        return ResponseEntity.ok(userService.getUserById(Long.valueOf(id)));
    }

    @GetMapping("/getByUsername")
    public ResponseEntity<UserModel> getUserByUser(@RequestParam String username) throws Exception {
        return ResponseEntity.ok(userService.getUserByUsername(username));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<UserModel> updateUser(@PathVariable String id, @RequestBody UserModel userModel) throws Exception {
        return ResponseEntity.ok(userService.updateUser(userModel, Long.valueOf(id)));
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<UserModel> deleteUser(@PathVariable String id) {
        userService.deleteUser(Long.valueOf(id));
        return ResponseEntity.noContent().build();
    }


}
