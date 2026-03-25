package com.example.examsystem.service;

import com.example.examsystem.dto.AdminDashboardDTO;
import com.example.examsystem.dto.StudentDashboardDTO;
import com.example.examsystem.model.Submission;
import com.example.examsystem.model.UserRole;
import com.example.examsystem.repository.ExamRepository;
import com.example.examsystem.repository.SubmissionRepository;
import com.example.examsystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final ExamRepository examRepository;
    private final SubmissionRepository submissionRepository;

    public AdminDashboardDTO getAdminDashboardStats() {
        return AdminDashboardDTO.builder()
            .totalStudents(userRepository.findByRole(UserRole.STUDENT).size())
            .totalAdmins(userRepository.findByRole(UserRole.ADMIN).size())
            .totalExams(examRepository.count())
            .totalSubmissions(submissionRepository.count())
            .build();
    }

    public StudentDashboardDTO getStudentDashboardStats(Long studentId) {
        List<Submission> submissions = submissionRepository.findByStudentId(studentId);
        double averageScore = submissions.stream()
                .mapToDouble(Submission::getScore)
                .average()
                .orElse(0.0);

        return StudentDashboardDTO.builder()
            .availableExams(examRepository.count())
            .completedExams(submissions.size())
            .averageScore(averageScore)
            .build();
    }
}
