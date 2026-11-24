package com.ebaazee.service;

import com.ebaazee.dto.ProductResponse;
import com.ebaazee.entity.Category;
import com.ebaazee.entity.Product;
import com.ebaazee.exception.ResourceNotFoundException;
import com.ebaazee.repository.BidRepository;
import com.ebaazee.repository.CategoryRepository;
import com.ebaazee.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BidRepository bidRepository;

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream().map(this::toResponse).toList();
    }

    public List<ProductResponse> getProductsByCategory(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + categoryId));
        return productRepository.findByCategory(category).stream().map(this::toResponse).toList();
    }

    public ProductResponse getProductById(Long id) {
        return productRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));
    }

    public ProductResponse toResponse(Product p) {
        return ProductResponse.builder()
                .productId(p.getProductId())
                .title(p.getTitle())
                .description(p.getDescription())
                .imageUrl(p.getImageUrl())
                .minBid(p.getMinBid())
                .maxBid(p.getMaxBid())
                .startTime(p.getStartTime())
                .endTime(p.getEndTime())
                .status(p.getStatus().name())
                .categoryName(p.getCategory().getName())
                .categoryId(p.getCategory().getCategoryId())
                .sellerName(p.getSeller().getName())
                .sellerId(p.getSeller().getUserId())
                .bidCount(bidRepository.countByProduct(p))
                .build();
    }
}
