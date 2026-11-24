package com.ebaazee.service;

import com.ebaazee.dto.ProductRequest;
import com.ebaazee.dto.ProductResponse;
import com.ebaazee.entity.Category;
import com.ebaazee.entity.Product;
import com.ebaazee.entity.User;
import com.ebaazee.exception.ResourceNotFoundException;
import com.ebaazee.repository.BidRepository;
import com.ebaazee.repository.CategoryRepository;
import com.ebaazee.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SellerService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductService productService;
    private final BidRepository bidRepository;

    public ProductResponse listProduct(ProductRequest req, User seller) {
        if (req.getMinBid().compareTo(req.getMaxBid()) >= 0)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Minimum bid must be less than maximum bid");

        Category category = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + req.getCategoryId()));
        LocalDateTime now = LocalDateTime.now();
        Product product = Product.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .imageUrl(req.getImageUrl())
                .minBid(req.getMinBid())
                .maxBid(req.getMaxBid())
                .startTime(now)
                .endTime(now.plusHours(req.getDurationHours()))
                .status(Product.Status.ACTIVE)
                .seller(seller)
                .category(category)
                .build();
        return productService.toResponse(productRepository.save(product));
    }

    public List<ProductResponse> getMyProducts(User seller) {
        return productRepository.findBySeller(seller).stream()
                .map(productService::toResponse).toList();
    }

    public ProductResponse updateProduct(Long productId, ProductRequest req, User seller) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + productId));

        if (!product.getSeller().getUserId().equals(seller.getUserId()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your product");

        if (product.getStatus() != Product.Status.ACTIVE)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Can only edit ACTIVE listings");

        if (bidRepository.countByProduct(product) > 0)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot edit a listing that already has bids");

        if (req.getMinBid().compareTo(req.getMaxBid()) >= 0)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Minimum bid must be less than maximum bid");

        Category category = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + req.getCategoryId()));
        product.setTitle(req.getTitle());
        product.setDescription(req.getDescription());
        product.setImageUrl(req.getImageUrl());
        product.setMinBid(req.getMinBid());
        product.setMaxBid(req.getMaxBid());
        product.setCategory(category);
        product.setEndTime(product.getStartTime().plusHours(req.getDurationHours()));
        return productService.toResponse(productRepository.save(product));
    }
}
