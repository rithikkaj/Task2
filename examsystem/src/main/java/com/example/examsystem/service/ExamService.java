package com.example.examsystem.service;

import com.example.examsystem.dto.ExamDTO;
import com.example.examsystem.dto.CreateExamRequest;
import com.example.examsystem.model.Exam;
import com.example.examsystem.model.User;
import com.example.examsystem.repository.ExamRepository;
import com.example.examsystem.repository.QuestionRepository;
import com.example.examsystem.exception.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ExamService {
    
    @Autowired
    private ExamRepository examRepository;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private QuestionRepository questionRepository;
    
    public ExamDTO createExam(CreateExamRequest request, Long adminId) {
        log.info("Creating new exam by admin: {}", adminId);
        
        User admin = userService.getUserEntityById(adminId);
        
        if (request.getDuration() == null || request.getDuration() <= 0) {
            throw new BadRequestException("Duration must be greater than 0");
        }
        
        Exam exam = Exam.builder()
            .title(request.getTitle())
            .description(request.getDescription())
            .duration(request.getDuration())
            .createdBy(admin)
            .totalQuestions(0)
            .build();
        
        Exam savedExam = examRepository.save(exam);
        log.info("Exam created successfully with id: {}", savedExam.getId());
        
        return convertToDTO(savedExam);
    }
    
    public ExamDTO getExamById(Long id) {
        Exam exam = examRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Exam not found with id: " + id));
        return convertToDTO(exam);
    }
    
    public List<ExamDTO> getAllExams() {
        return examRepository.findAll()
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public List<ExamDTO> getExamsCreatedByAdmin(Long adminId) {
        log.info("Fetching all exams created by admin: {}", adminId);
        return examRepository.findExamsByAdmin(adminId)
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public ExamDTO updateTotalQuestions(Long examId) {
        Exam exam = examRepository.findById(examId)
            .orElseThrow(() -> new ResourceNotFoundException("Exam not found with id: " + examId));
        
        exam.setTotalQuestions(Math.toIntExact(questionRepository.countByExamId(examId)));
        examRepository.save(exam);
        return convertToDTO(exam);
    }
    
    public Exam getExamEntityById(Long id) {
        return examRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Exam not found with id: " + id));
    }
    
    private ExamDTO convertToDTO(Exam exam) {
        return ExamDTO.builder()
            .id(exam.getId())
            .title(exam.getTitle())
            .description(exam.getDescription())
            .duration(exam.getDuration())
            .totalQuestions(exam.getTotalQuestions())
            .createdBy(exam.getCreatedBy().getName())
            .createdAt(exam.getCreatedAt())
            .build();
    }
}
