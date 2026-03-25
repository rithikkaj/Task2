package com.example.examsystem.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnswerFeedbackDTO {
    private Long questionId;
    private String questionText;
    private Character selectedOption;
    private Boolean isCorrect;
    private Character correctAnswer; 
}
