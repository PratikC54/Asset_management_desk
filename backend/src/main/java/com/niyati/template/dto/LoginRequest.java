package com.niyati.template.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class LoginRequest {
    @Email
    @NotEmpty
    private String email;

    @NotEmpty
    private String password;
}
