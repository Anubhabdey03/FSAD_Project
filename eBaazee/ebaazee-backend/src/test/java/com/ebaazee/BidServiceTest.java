package com.ebaazee;

import com.ebaazee.entity.Category;
import com.ebaazee.entity.Product;
import com.ebaazee.repository.CategoryRepository;
import com.ebaazee.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class BidServiceTest {

    @LocalServerPort int port;
    RestClient client;

    @Autowired CategoryRepository categoryRepository;
    @Autowired ProductRepository productRepository;

    Category cat;

    @BeforeEach
    void setup() {
        client = RestClient.builder().baseUrl("http://localhost:" + port).build();
        cat = categoryRepository.save(Category.builder().name("Tech").description("d").build());
    }

    private Map register(String name, String email, String role) {
        return client.post().uri("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("name", name, "email", email, "password", "Pass@123", "role", role))
                .retrieve().body(Map.class);
    }

    private RestClient authed(String token) {
        return RestClient.builder().baseUrl("http://localhost:" + port)
                .defaultHeader("Authorization", "Bearer " + token).build();
    }

    private Map listProduct(String sellerToken, String title) {
        return authed(sellerToken).post().uri("/api/seller/products")
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("title", title, "description", "d", "imageUrl", "",
                        "categoryId", cat.getCategoryId(),
                        "minBid", 100, "maxBid", 500, "durationHours", 24))
                .retrieve().body(Map.class);
    }

    @Test
    void validBidReturns200() {
        Map sellerAuth = register("Seller", "seller@bid.com", "SELLER");
        Map buyerAuth = register("Buyer", "buyer@bid.com", "BUYER");
        Map product = listProduct((String) sellerAuth.get("token"), "Phone");
        Long productId = ((Number) product.get("productId")).longValue();

        Map bid = authed((String) buyerAuth.get("token")).post()
                .uri("/api/products/" + productId + "/bid")
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("amount", 200))
                .retrieve().body(Map.class);

        assertThat(bid).containsKey("bidId");
        assertThat(bid.get("amount")).isNotNull();
    }

    @Test
    void duplicateBidReturns409() {
        Map sellerAuth = register("Seller2", "seller2@bid.com", "SELLER");
        Map buyerAuth = register("Buyer2", "buyer2@bid.com", "BUYER");
        Map product = listProduct((String) sellerAuth.get("token"), "Phone2");
        Long productId = ((Number) product.get("productId")).longValue();

        authed((String) buyerAuth.get("token")).post()
                .uri("/api/products/" + productId + "/bid")
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("amount", 200)).retrieve().body(Map.class);

        assertThatThrownBy(() ->
            authed((String) buyerAuth.get("token")).post()
                    .uri("/api/products/" + productId + "/bid")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("amount", 250)).retrieve().body(Map.class)
        ).isInstanceOf(HttpClientErrorException.Conflict.class);
    }

    @Test
    void bidOnFrozenProductReturns400() {
        Map sellerAuth = register("Seller3", "seller3@bid.com", "SELLER");
        Map buyerAuth = register("Buyer3", "buyer3@bid.com", "BUYER");
        Map adminAuth = register("Admin3", "admin3@bid.com", "ADMIN");
        Map product = listProduct((String) sellerAuth.get("token"), "Frozen");
        Long productId = ((Number) product.get("productId")).longValue();

        authed((String) adminAuth.get("token")).put()
                .uri("/api/admin/products/" + productId + "/freeze")
                .retrieve().body(Map.class);

        assertThatThrownBy(() ->
            authed((String) buyerAuth.get("token")).post()
                    .uri("/api/products/" + productId + "/bid")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("amount", 200)).retrieve().body(Map.class)
        ).isInstanceOf(HttpClientErrorException.BadRequest.class);
    }

    @Test
    void bidOnOwnProductReturns403() {
        Map sellerAuth = register("Seller4", "seller4@bid.com", "SELLER");
        Map product = listProduct((String) sellerAuth.get("token"), "Own");
        Long productId = ((Number) product.get("productId")).longValue();

        // Seller role cannot call the BUYER-only endpoint → 403
        assertThatThrownBy(() ->
            authed((String) sellerAuth.get("token")).post()
                    .uri("/api/products/" + productId + "/bid")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("amount", 200)).retrieve().body(Map.class)
        ).isInstanceOf(HttpClientErrorException.Forbidden.class);
    }

    @Test
    void bidBelowMinReturns400() {
        Map sellerAuth = register("Seller5", "seller5@bid.com", "SELLER");
        Map buyerAuth = register("Buyer5", "buyer5@bid.com", "BUYER");
        Map product = listProduct((String) sellerAuth.get("token"), "Cheap");
        Long productId = ((Number) product.get("productId")).longValue();

        assertThatThrownBy(() ->
            authed((String) buyerAuth.get("token")).post()
                    .uri("/api/products/" + productId + "/bid")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("amount", 50)).retrieve().body(Map.class)
        ).isInstanceOf(HttpClientErrorException.BadRequest.class);
    }

    @Test
    void bidOnExpiredAuctionReturns400() {
        Map sellerAuth = register("Seller6", "seller6@bid.com", "SELLER");
        Map buyerAuth = register("Buyer6", "buyer6@bid.com", "BUYER");
        Map product = listProduct((String) sellerAuth.get("token"), "ExpiredProd");
        Long productId = ((Number) product.get("productId")).longValue();

        // Override end_time to past via repository
        productRepository.findById(productId).ifPresent(p -> {
            p.setEndTime(LocalDateTime.now().minusHours(1));
            productRepository.save(p);
        });

        assertThatThrownBy(() ->
            authed((String) buyerAuth.get("token")).post()
                    .uri("/api/products/" + productId + "/bid")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("amount", 200)).retrieve().body(Map.class)
        ).isInstanceOf(HttpClientErrorException.BadRequest.class);
    }

    @Test
    void getBidStatsReturnsCountAverageHighestLowest() {
        Map sellerAuth = register("Seller7", "seller7@bid.com", "SELLER");
        Map buyer1Auth = register("Buyer7a", "buyer7a@bid.com", "BUYER");
        Map buyer2Auth = register("Buyer7b", "buyer7b@bid.com", "BUYER");
        Map product = listProduct((String) sellerAuth.get("token"), "Stats");
        Long productId = ((Number) product.get("productId")).longValue();

        authed((String) buyer1Auth.get("token")).post()
                .uri("/api/products/" + productId + "/bid")
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("amount", 200)).retrieve().body(Map.class);
        authed((String) buyer2Auth.get("token")).post()
                .uri("/api/products/" + productId + "/bid")
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("amount", 300)).retrieve().body(Map.class);

        Map stats = client.get().uri("/api/products/" + productId + "/bids/stats")
                .retrieve().body(Map.class);

        assertThat(((Number) stats.get("count")).intValue()).isEqualTo(2);
        assertThat(stats.get("highest")).isNotNull();
        assertThat(stats.get("lowest")).isNotNull();
        assertThat(stats.get("average")).isNotNull();
    }
}
