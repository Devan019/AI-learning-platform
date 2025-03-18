package com.ai.AI_Learning_Platform.repository;


import com.ai.AI_Learning_Platform.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CourseRepository extends JpaRepository<Course, UUID> {
    List<Course> findByUserId(UUID userId);
}
