package com.ebaazee.controller;

import com.ebaazee.dto.ProductRequest;
import com.ebaazee.dto.ProductResponse;
import com.ebaazee.entity.User;
import com.ebaazee.service.SellerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seller")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SELLER')")
public class SellerController {

    private final SellerService sellerService;

    @PostMapping("/products")
    public ProductResponse listProduct(@Valid @RequestBody ProductRequest request,
                                       @AuthenticationPrincipal User seller) {
        return sellerService.listProduct(request, seller);
    }

    @GetMapping("/products")
    public List<ProductResponse> getMyProducts(@AuthenticationPrincipal User seller) {
        return sellerService.getMyProducts(seller);
    }

    @PutMapping("/products/{id}")
    public ProductResponse updateProduct(@PathVariable Long id,
                                         @Valid @RequestBody ProductRequest request,
                                         @AuthenticationPrincipal User seller) {
        return sellerService.updateProduct(id, request, seller);
    }
}
