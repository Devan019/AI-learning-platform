package com.ai.AI_Learning_Platform.repository;
import com.ai.AI_Learning_Platform.model.CourseContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface CourseContentRepository extends JpaRepository<CourseContent, Long> {
}