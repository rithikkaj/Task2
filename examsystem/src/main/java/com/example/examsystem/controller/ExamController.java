package com.example.examsystem.controller;

import com.example.examsystem.dto.ExamDTO;
import com.example.examsystem.dto.CreateExamRequest;
import com.example.examsystem.service.ExamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;
import java.util.List;

@RestController
@RequestMapping("/api/exams")
@Slf4j
public class ExamController {
    
    @Autowired
    private ExamService examService;
    
    @PostMapping
    public ResponseEntity<ExamDTO> createExam(
        @RequestBody CreateExamRequest request,
        @RequestHeader(name = "X-User-Id") Long adminId) {
        log.info("Create exam endpoint called by admin: {}", adminId);
        ExamDTO examDTO = examService.createExam(request, adminId);
        return ResponseEntity.status(HttpStatus.CREATED).body(examDTO);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ExamDTO> getExamById(@PathVariable Long id) {
        log.info("Get exam endpoint called for id: {}", id);
        ExamDTO examDTO = examService.getExamById(id);
        return ResponseEntity.ok(examDTO);
    }
    
    @GetMapping
    public ResponseEntity<List<ExamDTO>> getAllExams() {
        log.info("Get all exams endpoint called");
        List<ExamDTO> exams = examService.getAllExams();
        return ResponseEntity.ok(exams);
    }
    
    @GetMapping("/admin/{adminId}")
    public ResponseEntity<List<ExamDTO>> getExamsCreatedByAdmin(@PathVariable Long adminId) {
        log.info("Get exams by admin endpoint called for admin: {}", adminId);
        List<ExamDTO> exams = examService.getExamsCreatedByAdmin(adminId);
        return ResponseEntity.ok(exams);
    }
}
