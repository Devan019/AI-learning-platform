package com.ai.AI_Learning_Platform.repository;

import com.ai.AI_Learning_Platform.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    User findByEmail(String email);
    User findByResetToken(UUID resetToken);

}