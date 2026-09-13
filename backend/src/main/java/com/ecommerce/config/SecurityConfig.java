package com.ecommerce.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.ecommerce.security.JwtAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter
    ) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http

            // ==========================================
            // DISABLE CSRF
            // ==========================================

            .csrf(csrf -> csrf.disable())


            // ==========================================
            // SESSION MANAGEMENT
            // JWT = STATELESS
            // ==========================================

            .sessionManagement(session ->
                    session.sessionCreationPolicy(
                            SessionCreationPolicy.STATELESS
                    )
            )


            // ==========================================
            // AUTHORIZATION RULES
            // ==========================================

            .authorizeHttpRequests(auth -> auth


                    // ==================================
                    // PUBLIC AUTH APIs
                    // ==================================

                    .requestMatchers(
                            "/api/auth/register",
                            "/api/auth/login",
                            "/api/users/register",
                            "/api/users/login"
                    ).permitAll()


                    // ==================================
                    // PUBLIC PRODUCT GET
                    // ==================================

                    .requestMatchers(
                            HttpMethod.GET,
                            "/api/products",
                            "/api/products/*"
                    ).permitAll()


                    // ==================================
                    // ADMIN PRODUCT MANAGEMENT
                    // ==================================

                    .requestMatchers(
                            HttpMethod.POST,
                            "/api/products"
                    ).hasAuthority("ROLE_ADMIN")

                    .requestMatchers(
                            HttpMethod.PUT,
                            "/api/products/*"
                    ).hasAuthority("ROLE_ADMIN")

                    .requestMatchers(
                            HttpMethod.DELETE,
                            "/api/products/*"
                    ).hasAuthority("ROLE_ADMIN")


                    // ==================================
                    // ADMIN - ALL ORDERS
                    // ==================================

                    .requestMatchers(
                            HttpMethod.GET,
                            "/api/orders"
                    ).hasAuthority("ROLE_ADMIN")


                    // ==================================
                    // USER / ADMIN - OWN ORDERS
                    // ==================================

                    .requestMatchers(
                            HttpMethod.GET,
                            "/api/orders/my-orders"
                    ).hasAnyAuthority(
                            "ROLE_USER",
                            "ROLE_ADMIN"
                    )

                    .requestMatchers(
                            HttpMethod.GET,
                            "/api/orders/*"
                    ).hasAnyAuthority(
                            "ROLE_USER",
                            "ROLE_ADMIN"
                    )


                    // ==================================
                    // CREATE ORDER
                    // ==================================

                    .requestMatchers(
                            HttpMethod.POST,
                            "/api/orders"
                    ).hasAnyAuthority(
                            "ROLE_USER",
                            "ROLE_ADMIN"
                    )


                    // ==================================
                    // ADMIN - UPDATE ORDER STATUS
                    // ==================================

                    .requestMatchers(
                            HttpMethod.PUT,
                            "/api/orders/*/status"
                    ).hasAuthority("ROLE_ADMIN")


                    // ==================================
                    // USER / ADMIN - CANCEL OWN ORDER
                    // ==================================

                    .requestMatchers(
                            HttpMethod.PUT,
                            "/api/orders/*/cancel"
                    ).hasAnyAuthority(
                            "ROLE_USER",
                            "ROLE_ADMIN"
                    )


                    // ==================================
                    // USER / ADMIN - DELETE OWN CANCELLED
                    // ==================================

                    .requestMatchers(
                            HttpMethod.DELETE,
                            "/api/orders/*"
                    ).hasAnyAuthority(
                            "ROLE_USER",
                            "ROLE_ADMIN"
                    )


                    // ==================================
                    // USER / ADMIN PROFILE
                    // ==================================

                    .requestMatchers(
                            "/api/auth/profile",
                            "/api/users/profile"
                    ).hasAnyAuthority(
                            "ROLE_USER",
                            "ROLE_ADMIN"
                    )


                    // ==================================
                    // CORS PREFLIGHT
                    // ==================================

                    .requestMatchers(
                            HttpMethod.OPTIONS,
                            "/**"
                    ).permitAll()


                    // ==================================
                    // EVERYTHING ELSE
                    // ==================================

                    .anyRequest().authenticated()
            )


            // ==========================================
            // CORS
            // ==========================================

            .cors(cors -> {
            })


            // ==========================================
            // JWT FILTER
            // ==========================================

            .addFilterBefore(
                    jwtAuthenticationFilter,
                    UsernamePasswordAuthenticationFilter.class
            );


        return http.build();
    }
}