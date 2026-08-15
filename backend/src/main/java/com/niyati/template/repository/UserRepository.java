package com.niyati.template.repository;

import com.niyati.template.models.USER_ROLE;
import com.niyati.template.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    User findByRole(USER_ROLE userRole);

    List<User> findAllByRole(USER_ROLE userRole);

    List<User> findEmailByRoleNot(USER_ROLE role);

}
