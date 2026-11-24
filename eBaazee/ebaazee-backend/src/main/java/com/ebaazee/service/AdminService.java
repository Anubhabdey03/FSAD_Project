package com.ebaazee.service;

import com.ebaazee.dto.ProductResponse;
import com.ebaazee.dto.PurchaseResponse;
import com.ebaazee.dto.UserSummary;
import com.ebaazee.entity.Bid;
import com.ebaazee.entity.Product;
import com.ebaazee.entity.Purchase;
import com.ebaazee.exception.ResourceNotFoundException;
import com.ebaazee.repository.BidRepository;
import com.ebaazee.repository.ProductRepository;
import com.ebaazee.repository.PurchaseRepository;
import com.ebaazee.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final BidRepository bidRepository;
    private final PurchaseRepository purchaseRepository;
    private final ProductService productService;
    private final JavaMailSender mailSender;

    public ProductResponse freezeAuction(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + productId));
        if (product.getStatus() != Product.Status.ACTIVE)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only ACTIVE auctions can be frozen");
        product.setStatus(Product.Status.FROZEN);
        return productService.toResponse(productRepository.save(product));
    }

    public ProductResponse unfreezeAuction(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + productId));
        if (product.getStatus() != Product.Status.FROZEN)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only FROZEN auctions can be unfrozen");
        product.setStatus(Product.Status.ACTIVE);
        return productService.toResponse(productRepository.save(product));
    }

    @Transactional
    public PurchaseResponse declareWinner(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + productId));

        if (product.getStatus() == Product.Status.CLOSED)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Auction is already closed");

        if (purchaseRepository.findByProduct(product).isPresent())
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Winner already declared for this product");

        List<Bid> bids = bidRepository.findByProduct(product);
        if (bids.isEmpty())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No bids placed — cannot declare a winner");

        Bid highestBid = bids.stream()
                .max(Comparator.comparing(Bid::getAmount))
                .orElseThrow();

        product.setStatus(Product.Status.CLOSED);
        productRepository.save(product);

        Purchase purchase = Purchase.builder()
                .amountPaid(highestBid.getAmount())
                .user(highestBid.getUser())
                .product(product)
                .build();
        purchase = purchaseRepository.save(purchase);

        final String winnerEmail = highestBid.getUser().getEmail();
        final String winnerName  = highestBid.getUser().getName();
        final String productTitle = product.getTitle();
        final String amount = highestBid.getAmount().toPlainString();
        new Thread(() -> sendWinnerEmail(winnerEmail, winnerName, productTitle, amount)).start();

        return PurchaseResponse.builder()
                .purchaseId(purchase.getPurchaseId())
                .purchaseTime(purchase.getPurchaseTime())
                .amountPaid(purchase.getAmountPaid())
                .productId(product.getProductId())
                .productTitle(product.getTitle())
                .userId(highestBid.getUser().getUserId())
                .build();
    }

    private void sendWinnerEmail(String email, String name, String productTitle, String amount) {
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo(email);
            msg.setSubject("Congratulations! You won the auction for " + productTitle);
            msg.setText("Dear " + name + ",\n\nThe admin has declared you the winner of the auction for \""
                    + productTitle + "\" with a winning bid of ₹" + amount
                    + ".\n\neBaazee Team");
            mailSender.send(msg);
        } catch (Exception ignored) {
            // Email failure does not fail the declaration
        }
    }

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream().map(productService::toResponse).toList();
    }

    public List<UserSummary> getAllUsers() {
        return userRepository.findAll().stream()
                .map(u -> UserSummary.builder()
                        .userId(u.getUserId())
                        .name(u.getName())
                        .email(u.getEmail())
                        .role(u.getRole().name())
                        .build())
                .toList();
    }
}
