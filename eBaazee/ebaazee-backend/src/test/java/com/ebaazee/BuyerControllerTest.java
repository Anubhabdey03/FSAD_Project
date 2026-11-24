package com.ebaazee;

import com.ebaazee.entity.Category;
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

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class BuyerControllerTest {

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

    private void placeBid(String buyerToken, Long productId, int amount) {
        authed(buyerToken).post()
                .uri("/api/products/" + productId + "/bid")
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("amount", amount)).retrieve().body(Map.class);
    }

    private void freeze(String adminToken, Long productId) {
        authed(adminToken).put()
                .uri("/api/admin/products/" + productId + "/freeze")
                .retrieve().body(Map.class);
    }

    @Test
    void getBuyerBidsReturnsBuyerBidsOnly() {
        Map sellerAuth = register("Seller", "seller@buyer.com", "SELLER");
        Map buyerAuth = register("Buyer", "buyer@buyer.com", "BUYER");
        Map product = listProduct((String) sellerAuth.get("token"), "Phone");
        placeBid((String) buyerAuth.get("token"), ((Number) product.get("productId")).longValue(), 200);

        List<?> bids = authed((String) buyerAuth.get("token")).get()
                .uri("/api/buyer/bids").retrieve().body(List.class);

        assertThat(bids).hasSize(1);
    }

    @Test
    void highestBidderCanPurchaseOnFrozenAuction() {
        Map sellerAuth = register("Seller2", "seller2@buyer.com", "SELLER");
        Map buyerAuth = register("Buyer2", "buyer2@buyer.com", "BUYER");
        Map adminAuth = register("Admin2", "admin2@buyer.com", "ADMIN");
        Map product = listProduct((String) sellerAuth.get("token"), "Laptop");
        Long productId = ((Number) product.get("productId")).longValue();

        placeBid((String) buyerAuth.get("token"), productId, 300);
        freeze((String) adminAuth.get("token"), productId);

        Map purchase = authed((String) buyerAuth.get("token")).post()
                .uri("/api/products/" + productId + "/purchase")
                .retrieve().body(Map.class);

        assertThat(purchase).containsKey("purchaseId");
        assertThat(purchase.get("amountPaid")).isNotNull();
    }

    @Test
    void nonHighestBidderCannotPurchase() {
        Map sellerAuth = register("Seller3", "seller3@buyer.com", "SELLER");
        Map winner = register("Winner", "winner@buyer.com", "BUYER");
        Map loser = register("Loser", "loser@buyer.com", "BUYER");
        Map adminAuth = register("Admin3", "admin3@buyer.com", "ADMIN");
        Map product = listProduct((String) sellerAuth.get("token"), "Camera");
        Long productId = ((Number) product.get("productId")).longValue();

        placeBid((String) winner.get("token"), productId, 400);
        placeBid((String) loser.get("token"), productId, 200);
        freeze((String) adminAuth.get("token"), productId);

        assertThatThrownBy(() ->
            authed((String) loser.get("token")).post()
                    .uri("/api/products/" + productId + "/purchase")
                    .retrieve().body(Map.class)
        ).isInstanceOf(HttpClientErrorException.Forbidden.class);
    }

    @Test
    void purchaseOnActiveAuctionReturns400() {
        Map sellerAuth = register("Seller4", "seller4@buyer.com", "SELLER");
        Map buyerAuth = register("Buyer4", "buyer4@buyer.com", "BUYER");
        Map product = listProduct((String) sellerAuth.get("token"), "Watch");
        Long productId = ((Number) product.get("productId")).longValue();

        placeBid((String) buyerAuth.get("token"), productId, 200);

        assertThatThrownBy(() ->
            authed((String) buyerAuth.get("token")).post()
                    .uri("/api/products/" + productId + "/purchase")
                    .retrieve().body(Map.class)
        ).isInstanceOf(HttpClientErrorException.BadRequest.class);
    }

    @Test
    void reportReturnsProductBidStats() {
        Map sellerAuth = register("Seller5", "seller5@buyer.com", "SELLER");
        Map buyerAuth = register("Buyer5", "buyer5@buyer.com", "BUYER");
        Map adminAuth = register("Admin5", "admin5@buyer.com", "ADMIN");
        Map product = listProduct((String) sellerAuth.get("token"), "Tablet");
        Long productId = ((Number) product.get("productId")).longValue();

        placeBid((String) buyerAuth.get("token"), productId, 250);

        Map report = authed((String) adminAuth.get("token")).get()
                .uri("/api/reports/products/" + productId)
                .retrieve().body(Map.class);

        assertThat(report.get("product")).isNotNull();
        assertThat(((Number) report.get("bidCount")).intValue()).isEqualTo(1);
        assertThat(report.get("highest")).isNotNull();
    }
}
