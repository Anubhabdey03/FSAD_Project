package com.ebaazee.controller;

import com.ebaazee.dto.BidResponse;
import com.ebaazee.dto.PurchaseResponse;
import com.ebaazee.entity.User;
import com.ebaazee.service.BuyerService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class BuyerController {

    private final BuyerService buyerService;

    @GetMapping("/buyer/bids")
    @PreAuthorize("hasRole('BUYER')")
    public List<BidResponse> getMyBids(@AuthenticationPrincipal User buyer) {
        return buyerService.getMyBids(buyer);
    }

    @GetMapping("/buyer/purchases")
    @PreAuthorize("hasRole('BUYER')")
    public List<PurchaseResponse> getMyPurchases(@AuthenticationPrincipal User buyer) {
        return buyerService.getMyPurchases(buyer);
    }

    @PostMapping("/products/{id}/purchase")
    @PreAuthorize("hasRole('BUYER')")
    public PurchaseResponse purchase(@PathVariable Long id,
                                     @AuthenticationPrincipal User buyer) {
        return buyerService.purchaseProduct(id, buyer);
    }
}
