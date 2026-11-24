package com.ebaazee.controller;

import com.ebaazee.dto.ProductResponse;
import com.ebaazee.dto.PurchaseResponse;
import com.ebaazee.dto.UserSummary;
import com.ebaazee.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/products")
    public List<ProductResponse> getAllProducts() {
        return adminService.getAllProducts();
    }

    @GetMapping("/users")
    public List<UserSummary> getAllUsers() {
        return adminService.getAllUsers();
    }

    @PutMapping("/products/{id}/freeze")
    public ProductResponse freezeAuction(@PathVariable Long id) {
        return adminService.freezeAuction(id);
    }

    @PutMapping("/products/{id}/unfreeze")
    public ProductResponse unfreezeAuction(@PathVariable Long id) {
        return adminService.unfreezeAuction(id);
    }

    @PostMapping("/products/{id}/declare-winner")
    public PurchaseResponse declareWinner(@PathVariable Long id) {
        return adminService.declareWinner(id);
    }
}

