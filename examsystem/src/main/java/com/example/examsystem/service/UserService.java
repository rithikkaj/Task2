package com.example.examsystem.service;

import com.example.examsystem.dto.UserDTO;
import com.example.examsystem.dto.UserRegisterRequest;
import com.example.examsystem.exception.BadRequestException;
import com.example.examsystem.exception.ResourceNotFoundException;
import com.example.examsystem.model.User;
import com.example.examsystem.model.UserRole;
import com.example.examsystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    public UserDTO registerUser(UserRegisterRequest request) {
        log.info("Registering new user: {}", request.getEmail());
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }
        
        User user = User.builder()
            .email(request.getEmail())
            .name(request.getName())
            .password(passwordEncoder.encode(request.getPassword()))
            .role(UserRole.valueOf(request.getRole().toUpperCase()))
            .build();
        
        User savedUser = userRepository.save(user);
        log.info("User registered successfully with id: {}", savedUser.getId());
        return convertToDTO(savedUser);
    }
    
    public com.example.examsystem.dto.LoginResponse loginUser(com.example.examsystem.dto.LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new com.example.examsystem.exception.UnauthorizedException("Invalid email or password"));
            
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new com.example.examsystem.exception.UnauthorizedException("Invalid email or password");
        }
        
        log.info("User {} logged in successfully", user.getEmail());
        
        return com.example.examsystem.dto.LoginResponse.builder()
            .id(user.getId())
            .name(user.getName())
            .email(user.getEmail())
            .role(user.getRole().toString())
            .message("Login successful")
            .build();
    }
    
    public UserDTO getUserById(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return convertToDTO(user);
    }
    
    public UserDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return convertToDTO(user);
    }
    
    public List<UserDTO> getAllStudents() {
        return userRepository.findByRole(UserRole.STUDENT)
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public List<UserDTO> getAllAdmins() {
        return userRepository.findByRole(UserRole.ADMIN)
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public User getUserEntityById(Long userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
    
    private UserDTO convertToDTO(User user) {
        return UserDTO.builder()
            .id(user.getId())
            .email(user.getEmail())
            .name(user.getName())
            .role(user.getRole().toString())
            .createdAt(user.getCreatedAt())
            .build();
    }
}
