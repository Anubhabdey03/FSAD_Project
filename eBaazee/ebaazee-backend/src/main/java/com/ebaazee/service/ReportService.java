package com.ebaazee.service;

import com.ebaazee.dto.BidResponse;
import com.ebaazee.dto.ReportResponse;
import com.ebaazee.entity.Bid;
import com.ebaazee.entity.Product;
import com.ebaazee.entity.User;
import com.ebaazee.exception.ResourceNotFoundException;
import com.ebaazee.repository.BidRepository;
import com.ebaazee.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ProductRepository productRepository;
    private final BidRepository bidRepository;
    private final ProductService productService;

    public ReportResponse getProductReport(Long productId, User requester) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + productId));

        boolean isAdmin = requester.getRole() == User.Role.ADMIN;
        boolean isOwner = product.getSeller().getUserId().equals(requester.getUserId());
        if (!isAdmin && !isOwner) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        List<Bid> bids = bidRepository.findByProduct(product);

        BigDecimal highest = bids.stream().map(Bid::getAmount).max(BigDecimal::compareTo).orElse(null);
        BigDecimal lowest = bids.stream().map(Bid::getAmount).min(BigDecimal::compareTo).orElse(null);
        BigDecimal average = null;
        if (!bids.isEmpty()) {
            BigDecimal sum = bids.stream().map(Bid::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
            average = sum.divide(BigDecimal.valueOf(bids.size()), 2, RoundingMode.HALF_UP);
        }

        List<BidResponse> bidResponses = bids.stream().map(b -> BidResponse.builder()
                .bidId(b.getBidId())
                .amount(b.getAmount())
                .bidTime(b.getBidTime())
                .userId(b.getUser().getUserId())
                .userName(b.getUser().getName())
                .productId(product.getProductId())
                .productTitle(product.getTitle())
                .build()).toList();

        return ReportResponse.builder()
                .product(productService.toResponse(product))
                .bidCount(bids.size())
                .highest(highest)
                .lowest(lowest)
                .average(average)
                .bids(bidResponses)
                .build();
    }
}
