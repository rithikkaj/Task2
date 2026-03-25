package com.example.examsystem.repository;

import com.example.examsystem.model.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    
    @Query("SELECT s FROM Submission s WHERE s.student.id = :studentId AND s.exam.id = :examId")
    Optional<Submission> findByStudentAndExam(@Param("studentId") Long studentId, @Param("examId") Long examId);
    
    @Query("SELECT s FROM Submission s WHERE s.student.id = :studentId ORDER BY s.submittedAt DESC")
    List<Submission> findByStudentId(@Param("studentId") Long studentId);
    
    @Query("SELECT s FROM Submission s WHERE s.exam.id = :examId ORDER BY s.submittedAt DESC")
    List<Submission> findByExamId(@Param("examId") Long examId);
    
    @Query("SELECT COUNT(s) FROM Submission s WHERE s.exam.id = :examId")
    long countByExamId(@Param("examId") Long examId);
}
