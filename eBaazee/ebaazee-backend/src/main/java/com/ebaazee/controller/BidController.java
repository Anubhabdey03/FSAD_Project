package com.ebaazee.controller;

import com.ebaazee.dto.BidRequest;
import com.ebaazee.dto.BidResponse;
import com.ebaazee.dto.BidStatsResponse;
import com.ebaazee.entity.User;
import com.ebaazee.service.BidService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class BidController {

    private final BidService bidService;

    @PostMapping("/api/products/{id}/bid")
    @PreAuthorize("hasRole('BUYER')")
    public BidResponse placeBid(@PathVariable Long id,
                                @RequestBody BidRequest request,
                                @AuthenticationPrincipal User buyer) {
        return bidService.placeBid(id, request, buyer);
    }

    @GetMapping("/api/products/{id}/bids/stats")
    public BidStatsResponse getBidStats(@PathVariable Long id) {
        return bidService.getBidStats(id);
    }
}
