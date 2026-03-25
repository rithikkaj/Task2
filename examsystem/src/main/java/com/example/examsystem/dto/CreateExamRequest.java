package com.example.examsystem.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateExamRequest {
    private String title;
    private String description;
    private Integer duration;
}
