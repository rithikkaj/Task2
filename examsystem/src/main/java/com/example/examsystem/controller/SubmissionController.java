package com.example.examsystem.controller;

import com.example.examsystem.dto.SubmitExamRequest;
import com.example.examsystem.dto.SubmissionResultDTO;
import com.example.examsystem.service.SubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;
import java.util.List;

@RestController
@RequestMapping("/api/submissions")
@Slf4j
public class SubmissionController {
    
    @Autowired
    private SubmissionService submissionService;
    
    @PostMapping("/submit")
    public ResponseEntity<SubmissionResultDTO> submitExam(
        @RequestBody SubmitExamRequest request,
        @RequestHeader(name = "X-User-Id") Long studentId) {
        log.info("Submit exam endpoint called by student: {} for exam: {}", studentId, request.getExamId());
        SubmissionResultDTO result = submissionService.submitExam(request, studentId);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }
    
    @GetMapping("/{submissionId}")
    public ResponseEntity<SubmissionResultDTO> getSubmissionResult(@PathVariable Long submissionId) {
        log.info("Get submission result endpoint called for submission: {}", submissionId);
        SubmissionResultDTO result = submissionService.getSubmissionResult(submissionId);
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<SubmissionResultDTO>> getStudentResults(@PathVariable Long studentId) {
        log.info("Get student results endpoint called for student: {}", studentId);
        List<SubmissionResultDTO> results = submissionService.getStudentResults(studentId);
        return ResponseEntity.ok(results);
    }
    
    @GetMapping("/exam/{examId}")
    public ResponseEntity<List<SubmissionResultDTO>> getExamResults(@PathVariable Long examId) {
        log.info("Get exam results endpoint called for exam: {}", examId);
        List<SubmissionResultDTO> results = submissionService.getExamResults(examId);
        return ResponseEntity.ok(results);
    }
}
