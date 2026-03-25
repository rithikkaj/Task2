package com.example.examsystem.repository;

import com.example.examsystem.model.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Long> {
    List<Exam> findByCreatedById(Long createdById);
    
    @Query("SELECT e FROM Exam e WHERE e.createdBy.id = :adminId ORDER BY e.createdAt DESC")
    List<Exam> findExamsByAdmin(@Param("adminId") Long adminId);
}
