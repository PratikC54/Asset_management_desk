package com.niyati.template.service;

import com.niyati.template.dto.UserResponse;
import com.niyati.template.models.USER_ROLE;
import com.niyati.template.models.User;
import com.niyati.template.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final UserRepository userRepository;

    public List<UserResponse> listEmployees() {
        return userRepository.findAll().stream()
                .filter(user -> user.getRole() == USER_ROLE.EMPLOYEE || user.getRole() == USER_ROLE.MANAGER)
                .map(UserResponse::from)
                .toList();
    }

    public User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
    }
}
