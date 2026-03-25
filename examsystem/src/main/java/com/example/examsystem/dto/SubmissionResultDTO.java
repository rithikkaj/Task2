package com.example.examsystem.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmissionResultDTO {
    private Long id;
    private String studentName;
    private String examTitle;
    private Double score;
    private Long submittedAt;
    private Integer totalQuestions;
    private Integer correctAnswers;
    private List<AnswerFeedbackDTO> feedback;
}
