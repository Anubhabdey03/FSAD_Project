package com.ebaazee.service;

import com.ebaazee.dto.BidResponse;
import com.ebaazee.dto.PurchaseResponse;
import com.ebaazee.entity.Bid;
import com.ebaazee.entity.Product;
import com.ebaazee.entity.Purchase;
import com.ebaazee.entity.User;
import com.ebaazee.exception.ResourceNotFoundException;
import com.ebaazee.repository.BidRepository;
import com.ebaazee.repository.ProductRepository;
import com.ebaazee.repository.PurchaseRepository;
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
public class BuyerService {

    private final BidRepository bidRepository;
    private final PurchaseRepository purchaseRepository;
    private final ProductRepository productRepository;
    private final BidService bidService;
    private final JavaMailSender mailSender;

    public List<BidResponse> getMyBids(User user) {
        return bidService.getBidsByUser(user);
    }

    public List<PurchaseResponse> getMyPurchases(User user) {
        return purchaseRepository.findByUser(user).stream().map(this::toResponse).toList();
    }

    @Transactional
    public PurchaseResponse purchaseProduct(Long productId, User buyer) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + productId));

        if (product.getStatus() != Product.Status.FROZEN) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Auction is not frozen");
        }

        if (purchaseRepository.findByProduct(product).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Product already purchased");
        }

        List<Bid> bids = bidRepository.findByProduct(product);
        if (bids.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No bids on this product");
        }

        Bid highestBid = bids.stream()
                .max(Comparator.comparing(Bid::getAmount)
                        .thenComparing(Comparator.comparing(Bid::getBidTime).reversed()))
                .orElseThrow();

        if (!highestBid.getUser().getUserId().equals(buyer.getUserId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not the highest bidder");
        }

        Purchase purchase = Purchase.builder()
                .amountPaid(highestBid.getAmount())
                .user(buyer)
                .product(product)
                .build();
        purchase = purchaseRepository.save(purchase);

        product.setStatus(Product.Status.CLOSED);
        productRepository.save(product);

        final String email = buyer.getEmail();
        final String name  = buyer.getName();
        final String title = product.getTitle();
        final String amt   = highestBid.getAmount().toString();
        new Thread(() -> sendWinnerEmail(email, name, title, amt)).start();

        return toResponse(purchase);
    }

    private void sendWinnerEmail(String email, String name, String productTitle, String amount) {
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo(email);
            msg.setSubject("Congratulations! You won the auction for " + productTitle);
            msg.setText("Dear " + name + ",\n\nYou have won the auction for \"" + productTitle
                    + "\" with a bid of " + amount + ".\n\nePlease complete your purchase.\n\neBaazee Team");
            mailSender.send(msg);
        } catch (Exception e) {
            // Email failure does not fail the purchase
        }
    }

    private PurchaseResponse toResponse(Purchase p) {
        return PurchaseResponse.builder()
                .purchaseId(p.getPurchaseId())
                .purchaseTime(p.getPurchaseTime())
                .amountPaid(p.getAmountPaid())
                .productId(p.getProduct().getProductId())
                .productTitle(p.getProduct().getTitle())
                .userId(p.getUser().getUserId())
                .build();
    }
}
