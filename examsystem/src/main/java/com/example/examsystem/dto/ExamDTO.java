package com.example.examsystem.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamDTO {
    private Long id;
    private String title;
    private String description;
    private Integer duration;
    private Integer totalQuestions;
    private String createdBy;
    private Long createdAt;
}
