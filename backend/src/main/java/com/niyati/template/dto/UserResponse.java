package com.niyati.template.dto;

import com.niyati.template.models.DEPARTMENT;
import com.niyati.template.models.USER_ROLE;
import com.niyati.template.models.User;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponse {
    private Long userId;
    private String name;
    private String email;
    private USER_ROLE role;
    private DEPARTMENT department;

    public static UserResponse from(User user) {
        return UserResponse.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .department(user.getDepartment())
                .build();
    }
}
