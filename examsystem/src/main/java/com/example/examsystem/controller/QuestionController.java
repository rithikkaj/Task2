package com.example.examsystem.controller;

import com.example.examsystem.dto.QuestionDTO;
import com.example.examsystem.dto.CreateQuestionRequest;
import com.example.examsystem.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;
import java.util.List;

@RestController
@RequestMapping("/api/questions")
@Slf4j
public class QuestionController {
    
    @Autowired
    private QuestionService questionService;
    
    @PostMapping
    public ResponseEntity<QuestionDTO> addQuestion(@RequestBody CreateQuestionRequest request,
                                                   @RequestHeader(name = "X-User-Id") Long adminId) {
        log.info("Add question endpoint called for exam: {}", request.getExamId());
        QuestionDTO questionDTO = questionService.addQuestionToExam(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(questionDTO);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<QuestionDTO> getQuestionById(@PathVariable Long id) {
        log.info("Get question endpoint called for id: {}", id);
        QuestionDTO questionDTO = questionService.getQuestionById(id);
        return ResponseEntity.ok(questionDTO);
    }
    
    @GetMapping("/exam/{examId}")
    public ResponseEntity<List<QuestionDTO>> getQuestionsByExamId(@PathVariable Long examId) {
        log.info("Get questions by exam endpoint called for exam: {}", examId);
        List<QuestionDTO> questions = questionService.getQuestionsByExamId(examId);
        return ResponseEntity.ok(questions);
    }
    
    @GetMapping("/exam/{examId}/student")
    public ResponseEntity<List<com.example.examsystem.dto.StudentQuestionDTO>> getStudentQuestionsByExamId(@PathVariable Long examId) {
        log.info("Get student questions by exam endpoint called for exam: {}", examId);
        List<com.example.examsystem.dto.StudentQuestionDTO> questions = questionService.getStudentQuestionsByExamId(examId);
        return ResponseEntity.ok(questions);
    }
}
