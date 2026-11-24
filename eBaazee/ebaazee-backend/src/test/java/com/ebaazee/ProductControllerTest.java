package com.ebaazee;

import com.ebaazee.entity.Category;
import com.ebaazee.repository.CategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class ProductControllerTest {

    @LocalServerPort int port;
    RestClient client;

    @Autowired CategoryRepository categoryRepository;

    @BeforeEach
    void setup() {
        client = RestClient.builder().baseUrl("http://localhost:" + port).build();
    }

    @Test
    void getAllProductsReturns200AndList() {
        List<?> body = client.get().uri("/api/products").retrieve().body(List.class);
        assertThat(body).isNotNull();
    }

    @Test
    void getNonExistentProductReturns404() {
        assertThatThrownBy(() ->
            client.get().uri("/api/products/99999").retrieve().body(Map.class)
        ).isInstanceOf(HttpClientErrorException.NotFound.class);
    }

    @Test
    void getProductsByCategoryReturnsFilteredList() {
        Category cat = categoryRepository.save(
                Category.builder().name("TestCat").description("d").build());

        List<?> body = client.get().uri("/api/products?category=" + cat.getCategoryId())
                .retrieve().body(List.class);
        assertThat(body).isNotNull();
    }
}
