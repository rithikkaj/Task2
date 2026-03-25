package com.example.examsystem.controller;

import com.example.examsystem.dto.AdminDashboardDTO;
import com.example.examsystem.dto.StudentDashboardDTO;
import com.example.examsystem.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/dashboard")
@Slf4j
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/admin")
    public ResponseEntity<AdminDashboardDTO> getAdminDashboard(@RequestHeader(name = "X-User-Id", required = false) Long adminId) {
        log.info("Admin dashboard accessed by: {}", adminId);
        return ResponseEntity.ok(dashboardService.getAdminDashboardStats());
    }

    @GetMapping("/student")
    public ResponseEntity<StudentDashboardDTO> getStudentDashboard(@RequestHeader(name = "X-User-Id") Long studentId) {
        log.info("Student dashboard accessed by: {}", studentId);
        return ResponseEntity.ok(dashboardService.getStudentDashboardStats(studentId));
    }
}
