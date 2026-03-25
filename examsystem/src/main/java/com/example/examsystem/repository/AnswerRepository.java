package com.example.examsystem.repository;

import com.example.examsystem.model.Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {
    List<Answer> findBySubmissionId(Long submissionId);
    
    @Query("SELECT COUNT(a) FROM Answer a WHERE a.submission.id = :submissionId AND a.isCorrect = true")
    long countCorrectAnswers(@Param("submissionId") Long submissionId);
}
