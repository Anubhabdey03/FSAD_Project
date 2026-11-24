package com.ebaazee;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class AuthControllerTest {

    @LocalServerPort int port;
    RestClient client;

    @BeforeEach
    void setup() {
        client = RestClient.builder().baseUrl("http://localhost:" + port).build();
    }

    private Map register(String name, String email, String password, String role) {
        return client.post().uri("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("name", name, "email", email, "password", password, "role", role))
                .retrieve().body(Map.class);
    }

    @Test
    void registerNewBuyerReturns200WithToken() {
        Map body = register("Alice", "alice@test.com", "Pass@123", "BUYER");

        assertThat(body).containsKey("token");
        assertThat(body.get("role")).isEqualTo("BUYER");
        assertThat(body.get("name")).isEqualTo("Alice");
    }

    @Test
    void loginWithCorrectCredentialsReturnsToken() {
        register("Bob", "bob@test.com", "Pass@123", "SELLER");

        Map body = client.post().uri("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("email", "bob@test.com", "password", "Pass@123"))
                .retrieve().body(Map.class);

        assertThat(body).containsKey("token");
        assertThat(body.get("role")).isEqualTo("SELLER");
    }

    @Test
    void loginWithWrongPasswordReturns401() {
        register("Carol", "carol@test.com", "Pass@123", "BUYER");

        assertThatThrownBy(() ->
            client.post().uri("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("email", "carol@test.com", "password", "WrongPass"))
                    .retrieve().body(Map.class)
        ).isInstanceOf(HttpClientErrorException.Unauthorized.class);
    }

    @Test
    void registerWithBlankEmailReturns400() {
        assertThatThrownBy(() ->
            client.post().uri("/api/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("name", "Test", "email", "", "password", "Pass@123", "role", "BUYER"))
                    .retrieve().body(Map.class)
        ).isInstanceOf(HttpClientErrorException.BadRequest.class);
    }

    @Test
    void registerWithInvalidEmailReturns400() {
        assertThatThrownBy(() ->
            client.post().uri("/api/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("name", "Test", "email", "not-an-email", "password", "Pass@123", "role", "BUYER"))
                    .retrieve().body(Map.class)
        ).isInstanceOf(HttpClientErrorException.BadRequest.class);
    }

    @Test
    void registerWithShortPasswordReturns400() {
        assertThatThrownBy(() ->
            client.post().uri("/api/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("name", "Test", "email", "test@test.com", "password", "abc", "role", "BUYER"))
                    .retrieve().body(Map.class)
        ).isInstanceOf(HttpClientErrorException.BadRequest.class);
    }
}


