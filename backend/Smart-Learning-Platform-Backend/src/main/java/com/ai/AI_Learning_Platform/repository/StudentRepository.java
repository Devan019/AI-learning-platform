package com.ai.AI_Learning_Platform.repository;

import com.ai.AI_Learning_Platform.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface StudentRepository extends JpaRepository<Student, UUID> {
    public Student findByEmail(String email);
}
