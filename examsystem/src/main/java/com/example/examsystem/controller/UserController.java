package com.example.examsystem.controller;

import com.example.examsystem.dto.UserDTO;
import com.example.examsystem.dto.UserRegisterRequest;
import com.example.examsystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@Slf4j
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/register")
    public ResponseEntity<UserDTO> registerUser(@RequestBody UserRegisterRequest request) {
        log.info("Register user endpoint called for email: {}", request.getEmail());
        UserDTO userDTO = userService.registerUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(userDTO);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        log.info("Get user endpoint called for id: {}", id);
        UserDTO userDTO = userService.getUserById(id);
        return ResponseEntity.ok(userDTO);
    }
    
    @GetMapping("/email/{email}")
    public ResponseEntity<UserDTO> getUserByEmail(@PathVariable String email) {
        log.info("Get user by email endpoint called for email: {}", email);
        UserDTO userDTO = userService.getUserByEmail(email);
        return ResponseEntity.ok(userDTO);
    }
    
    @GetMapping("/role/admin")
    public ResponseEntity<List<UserDTO>> getAllAdmins() {
        log.info("Get all admins endpoint called");
        List<UserDTO> admins = userService.getAllAdmins();
        return ResponseEntity.ok(admins);
    }
    
    @GetMapping("/role/student")
    public ResponseEntity<List<UserDTO>> getAllStudents() {
        log.info("Get all students endpoint called");
        List<UserDTO> students = userService.getAllStudents();
        return ResponseEntity.ok(students);
    }
}
