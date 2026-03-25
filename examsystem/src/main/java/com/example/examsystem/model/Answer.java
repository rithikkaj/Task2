package com.example.examsystem.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "answers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Answer {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submission_id", nullable = false)
    private Submission submission;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;
    
    @Column(nullable = false)
    private Character selectedOption; // A, B, C, or D
    
    @Column(nullable = false)
    private Boolean isCorrect;
    
    @Column(name = "created_at", updatable = false)
    private Long createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = System.currentTimeMillis();
        // Auto-evaluate if matching correct answer
        if (question != null && selectedOption != null) {
            this.isCorrect = selectedOption.equals(question.getCorrectAnswer());
        }
    }
}
