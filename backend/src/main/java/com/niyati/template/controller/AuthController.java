package com.niyati.template.controller;

import com.niyati.template.dto.LoginRequest;
import com.niyati.template.dto.RegisterRequest;
import com.niyati.template.dto.UserResponse;
import com.niyati.template.models.USER_ROLE;
import com.niyati.template.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/auth/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
        authService.createUser(request);
        return ResponseEntity.ok("User Registered ");
    }

    @PostMapping("/auth/login")
    public ResponseEntity<UserResponse> validateUser(@Valid @RequestBody LoginRequest request) {
        UserResponse user = authService.validateUser(request);
       if ( user == null)
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
       return ResponseEntity.status(HttpStatus.OK).body(user);
        }

    @PutMapping("/auth/role/{email}/{role}")
    public ResponseEntity<UserResponse> updateUserRole(@PathVariable String email, @PathVariable USER_ROLE role) {
        UserResponse updatedUser = authService.updateUserRole(email, role);
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/auth/me")
    public ResponseEntity<UserResponse> currentUser(Authentication authentication) {
        return ResponseEntity.ok(authService.getCurrentUser(authentication.getName()));
    }

    @GetMapping("/employees")
    public ResponseEntity<List<UserResponse>> getEmployees() {
        return ResponseEntity.ok(authService.getEmployees());
    }

    @GetMapping("/allusers")
    public ResponseEntity<List<String>> getAllUsers() {
        return ResponseEntity.ok(authService.getAllUsers());
    }
}
