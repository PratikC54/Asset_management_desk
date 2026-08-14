package com.niyati.template.dto;

import com.niyati.template.models.DEPARTMENT;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {


    private String name;

    @Email(message = "Entered mail-id is not valid one")
    private String email;

    @Size(min = 6, message = "Password least have 6 characters")
    private String password;

    private DEPARTMENT department;

}
