package com.ecommerce.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

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
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "https://shopzone1.up.railway.app"
        ));

        configuration.setAllowedMethods(List.of(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "OPTIONS"
        ));

        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(false);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            .sessionManagement(session ->
                    session.sessionCreationPolicy(
                            SessionCreationPolicy.STATELESS
                    )
            )

            .authorizeHttpRequests(auth -> auth

                    .requestMatchers(
                            "/api/auth/register",
                            "/api/auth/login",
                            "/api/users/register",
                            "/api/users/login"
                    ).permitAll()

                    .requestMatchers(
                            HttpMethod.GET,
                            "/api/products",
                            "/api/products/*"
                    ).permitAll()

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

                    .requestMatchers(
                            HttpMethod.GET,
                            "/api/orders"
                    ).hasAuthority("ROLE_ADMIN")

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

                    .requestMatchers(
                            HttpMethod.POST,
                            "/api/orders"
                    ).hasAnyAuthority(
                            "ROLE_USER",
                            "ROLE_ADMIN"
                    )

                    .requestMatchers(
                            HttpMethod.PUT,
                            "/api/orders/*/status"
                    ).hasAuthority("ROLE_ADMIN")

                    .requestMatchers(
                            HttpMethod.PUT,
                            "/api/orders/*/cancel"
                    ).hasAnyAuthority(
                            "ROLE_USER",
                            "ROLE_ADMIN"
                    )

                    .requestMatchers(
                            HttpMethod.DELETE,
                            "/api/orders/*"
                    ).hasAnyAuthority(
                            "ROLE_USER",
                            "ROLE_ADMIN"
                    )

                    .requestMatchers(
                            "/api/auth/profile",
                            "/api/users/profile"
                    ).hasAnyAuthority(
                            "ROLE_USER",
                            "ROLE_ADMIN"
                    )

                    .requestMatchers(
                            HttpMethod.OPTIONS,
                            "/**"
                    ).permitAll()

                    .anyRequest().authenticated()
            )

            .cors(cors -> {
            })

            .addFilterBefore(
                    jwtAuthenticationFilter,
                    UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}
