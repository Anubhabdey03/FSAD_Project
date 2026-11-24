package com.ebaazee.controller;

import com.ebaazee.dto.ReportResponse;
import com.ebaazee.entity.User;
import com.ebaazee.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/products/{id}")
    public ReportResponse getReport(@PathVariable Long id,
                                    @AuthenticationPrincipal User requester) {
        return reportService.getProductReport(id, requester);
    }
}
