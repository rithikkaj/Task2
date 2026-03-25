package com.example.examsystem.service;

import com.example.examsystem.dto.QuestionDTO;
import com.example.examsystem.dto.CreateQuestionRequest;
import com.example.examsystem.model.Question;
import com.example.examsystem.model.Exam;
import com.example.examsystem.repository.QuestionRepository;
import com.example.examsystem.repository.ExamRepository;
import com.example.examsystem.exception.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class QuestionService {
    
    @Autowired
    private QuestionRepository questionRepository;
    
    @Autowired
    private ExamRepository examRepository;
    
    public QuestionDTO addQuestionToExam(CreateQuestionRequest request) {
        log.info("Adding question to exam: {}", request.getExamId());
        
        Exam exam = examRepository.findById(request.getExamId())
            .orElseThrow(() -> new ResourceNotFoundException("Exam not found with id: " + request.getExamId()));
        
        validateQuestion(request);
        
        Question question = Question.builder()
            .questionText(request.getQuestionText())
            .optionA(request.getOptionA())
            .optionB(request.getOptionB())
            .optionC(request.getOptionC())
            .optionD(request.getOptionD())
            .correctAnswer(request.getCorrectAnswer())
            .exam(exam)
            .build();
        
        Question savedQuestion = questionRepository.save(question);
        
        exam.setTotalQuestions(Math.toIntExact(questionRepository.countByExamId(exam.getId())));
        examRepository.save(exam);
        
        log.info("Question added successfully with id: {}", savedQuestion.getId());
        
        return convertToDTO(savedQuestion);
    }
    
    public QuestionDTO getQuestionById(Long id) {
        Question question = questionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + id));
        return convertToDTO(question);
    }
    
    public List<QuestionDTO> getQuestionsByExamId(Long examId) {
        log.info("Fetching questions for exam: {}", examId);
        return questionRepository.findByExamId(examId)
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public List<com.example.examsystem.dto.StudentQuestionDTO> getStudentQuestionsByExamId(Long examId) {
        log.info("Fetching student questions for exam: {}", examId);
        return questionRepository.findByExamId(examId)
            .stream()
            .map(q -> com.example.examsystem.dto.StudentQuestionDTO.builder()
                .id(q.getId())
                .questionText(q.getQuestionText())
                .optionA(q.getOptionA())
                .optionB(q.getOptionB())
                .optionC(q.getOptionC())
                .optionD(q.getOptionD())
                .examId(q.getExam().getId())
                .build())
            .collect(Collectors.toList());
    }
    
    public List<Question> getQuestionsEntityByExamId(Long examId) {
        return questionRepository.findByExamId(examId);
    }
    
    public Question getQuestionEntityById(Long id) {
        return questionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + id));
    }
    
    private void validateQuestion(CreateQuestionRequest request) {
        if (request.getQuestionText() == null || request.getQuestionText().isEmpty()) {
            throw new BadRequestException("Question text cannot be empty");
        }
        
        if (request.getOptionA() == null || request.getOptionA().isEmpty() ||
            request.getOptionB() == null || request.getOptionB().isEmpty() ||
            request.getOptionC() == null || request.getOptionC().isEmpty() ||
            request.getOptionD() == null || request.getOptionD().isEmpty()) {
            throw new BadRequestException("All options must be provided");
        }
        
        if (request.getCorrectAnswer() == null || !isValidOption(request.getCorrectAnswer())) {
            throw new BadRequestException("Correct answer must be A, B, C, or D");
        }
    }
    
    private boolean isValidOption(Character option) {
        return option == 'A' || option == 'B' || option == 'C' || option == 'D';
    }
    
    private QuestionDTO convertToDTO(Question question) {
        return QuestionDTO.builder()
            .id(question.getId())
            .questionText(question.getQuestionText())
            .optionA(question.getOptionA())
            .optionB(question.getOptionB())
            .optionC(question.getOptionC())
            .optionD(question.getOptionD())
            .correctAnswer(question.getCorrectAnswer())
            .examId(question.getExam().getId())
            .build();
    }
}
