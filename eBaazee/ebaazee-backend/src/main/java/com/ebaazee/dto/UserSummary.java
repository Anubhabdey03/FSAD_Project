package com.ebaazee.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserSummary {
    private Long userId;
    private String name;
    private String email;
    private String role;
}
