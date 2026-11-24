package com.ebaazee.service;

import com.ebaazee.dto.BidRequest;
import com.ebaazee.dto.BidResponse;
import com.ebaazee.dto.BidStatsResponse;
import com.ebaazee.entity.Bid;
import com.ebaazee.entity.Product;
import com.ebaazee.entity.User;
import com.ebaazee.exception.ResourceNotFoundException;
import com.ebaazee.repository.BidRepository;
import com.ebaazee.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BidService {

    private final BidRepository bidRepository;
    private final ProductRepository productRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public BidResponse placeBid(Long productId, BidRequest req, User buyer) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + productId));

        if (product.getSeller().getUserId().equals(buyer.getUserId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Cannot bid on your own product");
        }

        if (product.getStatus() != Product.Status.ACTIVE || LocalDateTime.now().isAfter(product.getEndTime())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Auction is not active");
        }

        if (req.getAmount().compareTo(product.getMinBid()) < 0
                || req.getAmount().compareTo(product.getMaxBid()) > 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bid amount out of range");
        }

        if (bidRepository.findByUserAndProduct(buyer, product).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Already placed a bid on this product");
        }

        Bid bid = Bid.builder()
                .amount(req.getAmount())
                .user(buyer)
                .product(product)
                .build();
        bid = bidRepository.save(bid);

        // Auto-freeze when any buyer bids the maximum amount
        if (req.getAmount().compareTo(product.getMaxBid()) == 0) {
            product.setStatus(Product.Status.FROZEN);
            productRepository.save(product);
        }

        BidStatsResponse stats = getBidStats(productId);
        messagingTemplate.convertAndSend("/topic/products/" + productId, stats);

        return toResponse(bid);
    }

    public BidStatsResponse getBidStats(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + productId));
        List<Bid> bids = bidRepository.findByProduct(product);

        if (bids.isEmpty()) {
            return BidStatsResponse.builder().count(0).build();
        }

        BigDecimal highest = bids.stream().map(Bid::getAmount).max(BigDecimal::compareTo).orElse(BigDecimal.ZERO);
        BigDecimal lowest = bids.stream().map(Bid::getAmount).min(BigDecimal::compareTo).orElse(BigDecimal.ZERO);
        BigDecimal sum = bids.stream().map(Bid::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal average = sum.divide(BigDecimal.valueOf(bids.size()), 2, RoundingMode.HALF_UP);

        return BidStatsResponse.builder()
                .count(bids.size())
                .highest(highest)
                .lowest(lowest)
                .average(average)
                .build();
    }

    public List<BidResponse> getBidsByUser(User user) {
        return bidRepository.findByUser(user).stream().map(this::toResponse).toList();
    }

    private BidResponse toResponse(Bid bid) {
        return BidResponse.builder()
                .bidId(bid.getBidId())
                .amount(bid.getAmount())
                .bidTime(bid.getBidTime())
                .userId(bid.getUser().getUserId())
                .userName(bid.getUser().getName())
                .productId(bid.getProduct().getProductId())
                .productTitle(bid.getProduct().getTitle())
                .build();
    }
}
