package com.ai.AI_Learning_Platform.repository;

import com.ai.AI_Learning_Platform.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AdminRepository extends JpaRepository<Admin, UUID> {
    public  Admin findByOtp(int otp);
}
