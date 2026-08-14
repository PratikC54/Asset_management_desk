package com.niyati.template.service;

import com.niyati.template.dto.LoginRequest;
import com.niyati.template.dto.RegisterRequest;
import com.niyati.template.dto.UserResponse;
import com.niyati.template.models.USER_ROLE;
import com.niyati.template.models.User;
import com.niyati.template.repository.UserRepository;
import com.niyati.template.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

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
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        user.setRole(role);
        userRepository.save(user);
        return UserResponse.from(user);
    }

    public UserResponse validateUser(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        String role = authentication.getAuthorities().stream()
                .map(authority -> authority.getAuthority())
                .filter(authority -> authority.startsWith("ROLE_"))
                .map(authority -> authority.substring("ROLE_".length()))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Authenticated user has no role"));

        return UserResponse.builder()
                .accessToken(jwtService.generateJwtToken(authentication.getName(), role))
                .build();
    }

    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return UserResponse.from(user);
    }

    public List<UserResponse> getEmployees() {
        return userRepository.findAllByRole(USER_ROLE.EMPLOYEE)
                .stream()
                .map(UserResponse::from)
                .toList();
    }

    public List<String> getAllUsers() {
        return userRepository.findEmailByRoleNot(USER_ROLE.ADMIN)
                .stream()
                .map(User::getEmail)
                .collect(Collectors.toList());
    }

}
