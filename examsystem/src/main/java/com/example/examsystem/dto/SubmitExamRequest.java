package com.example.examsystem.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubmitExamRequest {
    private Long examId;
    private List<AnswerRequest> answers;
}
