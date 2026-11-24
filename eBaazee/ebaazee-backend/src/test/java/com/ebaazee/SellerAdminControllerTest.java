package com.ebaazee;

import com.ebaazee.entity.Category;
import com.ebaazee.repository.CategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class SellerAdminControllerTest {

    @LocalServerPort int port;
    RestClient client;

    @Autowired CategoryRepository categoryRepository;

    @BeforeEach
    void setup() {
        client = RestClient.builder().baseUrl("http://localhost:" + port).build();
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

    @Test
    void sellerCanListProduct() {
        Map sellerAuth = register("Seller1", "seller1@test.com", "SELLER");
        String token = (String) sellerAuth.get("token");
        Category cat = categoryRepository.save(Category.builder().name("Electronics").description("d").build());

        Map body = authed(token).post().uri("/api/seller/products")
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of(
                        "title", "iPhone 15",
                        "description", "Latest model",
                        "imageUrl", "",
                        "categoryId", cat.getCategoryId(),
                        "minBid", 1000,
                        "maxBid", 5000,
                        "durationHours", 24
                ))
                .retrieve().body(Map.class);

        assertThat(body.get("title")).isEqualTo("iPhone 15");
        assertThat(body.get("status")).isEqualTo("ACTIVE");
    }

    @Test
    void buyerCannotListProduct() {
        Map buyerAuth = register("Buyer1", "buyer1@test.com", "BUYER");
        String token = (String) buyerAuth.get("token");

        assertThatThrownBy(() ->
            authed(token).post().uri("/api/seller/products")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("title", "Test"))
                    .retrieve().body(Map.class)
        ).isInstanceOf(HttpClientErrorException.Forbidden.class);
    }

    @Test
    void adminCanFreezeAuction() {
        Map sellerAuth = register("Seller2", "seller2@test.com", "SELLER");
        Map adminAuth = register("Admin1", "admintest@test.com", "ADMIN");
        Category cat = categoryRepository.save(Category.builder().name("Books").description("d").build());

        // seller lists product
        Map product = authed((String) sellerAuth.get("token")).post().uri("/api/seller/products")
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of(
                        "title", "Book", "description", "d", "imageUrl", "",
                        "categoryId", cat.getCategoryId(),
                        "minBid", new BigDecimal("10"), "maxBid", new BigDecimal("100"),
                        "durationHours", 1
                ))
                .retrieve().body(Map.class);

        Long productId = ((Number) product.get("productId")).longValue();

        // admin freezes it
        Map frozen = authed((String) adminAuth.get("token")).put()
                .uri("/api/admin/products/" + productId + "/freeze")
                .retrieve().body(Map.class);

        assertThat(frozen.get("status")).isEqualTo("FROZEN");
    }

    @Test
    void sellerCannotFreezeAuction() {
        Map sellerAuth = register("Seller3", "seller3@test.com", "SELLER");

        assertThatThrownBy(() ->
            authed((String) sellerAuth.get("token")).put()
                    .uri("/api/admin/products/1/freeze")
                    .retrieve().body(Map.class)
        ).isInstanceOf(HttpClientErrorException.Forbidden.class);
    }

    @Test
    void sellerCannotListProductWithMinBidGreaterThanMaxBid() {
        Map sellerAuth = register("Seller4", "seller4@test.com", "SELLER");
        String token = (String) sellerAuth.get("token");
        Category cat = categoryRepository.save(Category.builder().name("Fashion").description("d").build());

        assertThatThrownBy(() ->
            authed(token).post().uri("/api/seller/products")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of(
                            "title", "Bad Product",
                            "description", "d", "imageUrl", "",
                            "categoryId", cat.getCategoryId(),
                            "minBid", 5000,
                            "maxBid", 1000,
                            "durationHours", 24
                    ))
                    .retrieve().body(Map.class)
        ).isInstanceOf(HttpClientErrorException.BadRequest.class);
    }

    @Test
    void sellerCannotListProductWithBlankTitle() {
        Map sellerAuth = register("Seller5", "seller5@test.com", "SELLER");
        String token = (String) sellerAuth.get("token");
        Category cat = categoryRepository.save(Category.builder().name("Garden").description("d").build());

        assertThatThrownBy(() ->
            authed(token).post().uri("/api/seller/products")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of(
                            "title", "",
                            "description", "d", "imageUrl", "",
                            "categoryId", cat.getCategoryId(),
                            "minBid", 100, "maxBid", 500,
                            "durationHours", 24
                    ))
                    .retrieve().body(Map.class)
        ).isInstanceOf(HttpClientErrorException.BadRequest.class);
    }
}
