package com.niyati.template.controller;

import com.niyati.template.dto.LoginRequest;
import com.niyati.template.dto.RegisterRequest;
import com.niyati.template.dto.UserResponse;
import com.niyati.template.models.USER_ROLE;
import com.niyati.template.models.User;
import com.niyati.template.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class AuthController {

    private final AuthService authService;

    @PostMapping("/auth/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
        authService.createUser(request);
        return ResponseEntity.ok("User Registered ");
    }

    @PostMapping("/auth/login")
    public ResponseEntity<UserResponse> validateUser(@RequestBody LoginRequest request) {
        UserResponse user = authService.validateUser(request);
       if ( user == null)
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
       return ResponseEntity.status(HttpStatus.CREATED).body(user);

    }

    @PutMapping("/auth/role/{email}/{role}")
    public ResponseEntity<UserResponse> updateUserRole(@PathVariable String email, @PathVariable USER_ROLE role) {
        UserResponse updatedUser = authService.updateUserRole(email, role);
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("employees")
    public ResponseEntity<List<UserResponse>> getEmployees() {
        return ResponseEntity.ok(authService.getEmployees());
    }

}
