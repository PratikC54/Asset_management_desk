package com.niyati.template.service;

import com.niyati.template.dto.LoginRequest;
import com.niyati.template.dto.RegisterRequest;
import com.niyati.template.dto.UserResponse;
import com.niyati.template.models.USER_ROLE;
import com.niyati.template.models.User;
import com.niyati.template.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public void createUser(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email is already registered.");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .department(request.getDepartment())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(USER_ROLE.EMPLOYEE)
                .build();

        userRepository.save(user);
    }

    public UserResponse updateUserRole(String email, USER_ROLE role) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.setRole(role);
        userRepository.save(user);
        return UserResponse.from(user);
    }

    public UserResponse validateUser(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email id"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid password.");
        }

        return UserResponse.from(user);
    }

    public List<UserResponse> getEmployees() {
        return userRepository.findAllByRole(USER_ROLE.EMPLOYEE)
                .stream()
                .map(UserResponse::from)
                .toList();
    }
}
