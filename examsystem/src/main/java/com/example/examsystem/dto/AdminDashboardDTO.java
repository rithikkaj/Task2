package com.example.examsystem.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDashboardDTO {
    private long totalStudents;
    private long totalAdmins;
    private long totalExams;
    private long totalSubmissions;
}
