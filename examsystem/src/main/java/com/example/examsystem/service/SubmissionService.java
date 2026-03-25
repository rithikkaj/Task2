package com.example.examsystem.service;

import com.example.examsystem.dto.SubmitExamRequest;
import com.example.examsystem.dto.AnswerRequest;
import com.example.examsystem.dto.SubmissionResultDTO;
import com.example.examsystem.model.*;
import com.example.examsystem.repository.SubmissionRepository;
import com.example.examsystem.repository.AnswerRepository;
import com.example.examsystem.exception.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.slf4j.Slf4j;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Optional;

@Service
@Slf4j
public class SubmissionService {
    
    @Autowired
    private SubmissionRepository submissionRepository;
    
    @Autowired
    private AnswerRepository answerRepository;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private ExamService examService;
    
    @Autowired
    private QuestionService questionService;
    
    @Transactional
    public SubmissionResultDTO submitExam(SubmitExamRequest request, Long studentId) {
        log.info("Student {} submitting exam {}", studentId, request.getExamId());
        
        User student = userService.getUserEntityById(studentId);
        Exam exam = examService.getExamEntityById(request.getExamId());
        
        Optional<Submission> existingSubmission = submissionRepository
            .findByStudentAndExam(studentId, request.getExamId());
        
        if (existingSubmission.isPresent()) {
            throw new BadRequestException("You have already submitted this exam. One student can only submit one exam once.");
        }
        
        Submission submission = Submission.builder()
            .student(student)
            .exam(exam)
            .score(0.0)
            .build();
        
        Submission savedSubmission = submissionRepository.save(submission);
        
        List<Answer> savedAnswers = new java.util.ArrayList<>();
        int correctCount = 0;
        for (AnswerRequest answerReq : request.getAnswers()) {
            Question question = questionService.getQuestionEntityById(answerReq.getQuestionId());
            
            if (!isValidOption(answerReq.getSelectedOption())) {
                throw new BadRequestException("Invalid option selected for question: " + answerReq.getQuestionId());
            }
            
            Answer answer = Answer.builder()
                .submission(savedSubmission)
                .question(question)
                .selectedOption(answerReq.getSelectedOption())
                .isCorrect(answerReq.getSelectedOption().equals(question.getCorrectAnswer()))
                .build();
            
            answerRepository.save(answer);
            savedAnswers.add(answer);
            
            if (answer.getIsCorrect()) {
                correctCount++;
            }
        }
        
        double score = calculateScore(correctCount, exam.getTotalQuestions());
        savedSubmission.setScore(score);
        submissionRepository.save(savedSubmission);
        
        log.info("Exam submitted successfully. Submission ID: {}, Score: {}", savedSubmission.getId(), score);
        
        return convertToDTO(savedSubmission, correctCount, savedAnswers);
    }
    
    public SubmissionResultDTO getSubmissionResult(Long submissionId) {
        Submission submission = submissionRepository.findById(submissionId)
            .orElseThrow(() -> new ResourceNotFoundException("Submission not found with id: " + submissionId));
        
        long correctCount = answerRepository.countCorrectAnswers(submissionId);
        List<Answer> answers = answerRepository.findBySubmissionId(submissionId);
        
        return convertToDTO(submission, Math.toIntExact(correctCount), answers);
    }
    
    public List<SubmissionResultDTO> getStudentResults(Long studentId) {
        log.info("Fetching results for student: {}", studentId);
        
        userService.getUserEntityById(studentId);
        
        return submissionRepository.findByStudentId(studentId)
            .stream()
            .map(submission -> {
                long correctCount = answerRepository.countCorrectAnswers(submission.getId());
                List<Answer> answers = answerRepository.findBySubmissionId(submission.getId());
                return convertToDTO(submission, Math.toIntExact(correctCount), answers);
            })
            .collect(Collectors.toList());
    }
    
    public List<SubmissionResultDTO> getExamResults(Long examId) {
        log.info("Fetching all results for exam: {}", examId);
        
        examService.getExamEntityById(examId);
        
        return submissionRepository.findByExamId(examId)
            .stream()
            .map(submission -> {
                long correctCount = answerRepository.countCorrectAnswers(submission.getId());
                List<Answer> answers = answerRepository.findBySubmissionId(submission.getId());
                return convertToDTO(submission, Math.toIntExact(correctCount), answers);
            })
            .collect(Collectors.toList());
    }
    
    public List<Answer> getSubmissionAnswers(Long submissionId) {
        return answerRepository.findBySubmissionId(submissionId);
    }
    
    private double calculateScore(int correctAnswers, int totalQuestions) {
        if (totalQuestions == 0) {
            return 0.0;
        }
        return (double) correctAnswers / totalQuestions * 100;
    }
    
    private boolean isValidOption(Character option) {
        return option == 'A' || option == 'B' || option == 'C' || option == 'D';
    }
    
    private SubmissionResultDTO convertToDTO(Submission submission, int correctAnswers, List<Answer> answers) {
        List<com.example.examsystem.dto.AnswerFeedbackDTO> feedback = answers.stream().map(a -> {
            var fb = com.example.examsystem.dto.AnswerFeedbackDTO.builder()
                .questionId(a.getQuestion().getId())
                .questionText(a.getQuestion().getQuestionText())
                .selectedOption(a.getSelectedOption())
                .isCorrect(a.getIsCorrect());
            if (!a.getIsCorrect()) {
                fb.correctAnswer(a.getQuestion().getCorrectAnswer());
            }
            return fb.build();
        }).collect(Collectors.toList());

        return SubmissionResultDTO.builder()
            .id(submission.getId())
            .studentName(submission.getStudent().getName())
            .examTitle(submission.getExam().getTitle())
            .score(submission.getScore())
            .submittedAt(submission.getSubmittedAt())
            .totalQuestions(submission.getExam().getTotalQuestions())
            .correctAnswers(correctAnswers)
            .feedback(feedback)
            .build();
    }
}
