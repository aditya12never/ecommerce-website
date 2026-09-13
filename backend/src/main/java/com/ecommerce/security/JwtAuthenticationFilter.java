package com.ecommerce.security;

import java.io.IOException;
import java.util.Collections;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.ecommerce.service.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(
            JwtService jwtService
    ) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authorizationHeader =
                request.getHeader("Authorization");
                
                System.out.println("REQUEST: " + request.getMethod() + " " + request.getRequestURI());
                System.out.println("AUTH HEADER PRESENT: " + (authorizationHeader != null));

        // =========================================
        // CHECK AUTHORIZATION HEADER
        // =========================================

        if (authorizationHeader == null ||
                authorizationHeader.isBlank()) {

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }

        if (!authorizationHeader.startsWith("Bearer ")) {

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }


        // =========================================
        // EXTRACT JWT TOKEN
        // =========================================

        String token =
                authorizationHeader.substring(7).trim();

                System.out.println("JWT TOKEN RECEIVED");

        if (token.isEmpty()) {

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }


        try {

            // =========================================
            // VALIDATE TOKEN
            // =========================================

            if (!jwtService.isTokenValid(token)) {

                filterChain.doFilter(
                        request,
                        response
                );

                return;
            }


            // =========================================
            // EXTRACT USER EMAIL
            // =========================================

            String email =
                    jwtService.extractEmail(token);


            // =========================================
            // EXTRACT USER ROLE
            // =========================================

            String role =
                    jwtService.extractRole(token);


            if (email == null ||
                    email.isBlank()) {

                filterChain.doFilter(
                        request,
                        response
                );

                return;
            }


            // =========================================
            // NORMALIZE ROLE
            // =========================================

            if (role == null ||
                    role.isBlank()) {

                role = "USER";
            }

            role = role
                    .trim()
                    .toUpperCase();

            // Remove ROLE_ if token already contains it
            if (role.startsWith("ROLE_")) {
                role = role.substring(5);
            }


            // =========================================
            // CREATE SPRING AUTHORITY
            // =========================================

            SimpleGrantedAuthority authority =
                    new SimpleGrantedAuthority(
                            "ROLE_" + role
                    );


            // =========================================
            // CREATE AUTHENTICATION
            // =========================================

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            email,
                            null,
                            Collections.singletonList(
                                    authority
                            )
                    );


            // =========================================
            // ADD REQUEST DETAILS
            // =========================================

            authentication.setDetails(
                    new WebAuthenticationDetailsSource()
                            .buildDetails(request)
            );


            // =========================================
            // SET SECURITY CONTEXT
            // =========================================

            SecurityContextHolder
                    .getContext()
                    .setAuthentication(
                            authentication
                    );

                    System.out.println(
        "AUTHENTICATED: " + email +
        " ROLE: " + role
);

        } catch (Exception e) {

    System.out.println(
            "JWT ERROR: " + e.getClass().getName()
    );

    System.out.println(
            "JWT ERROR MESSAGE: " + e.getMessage()
    );

    SecurityContextHolder
            .clearContext();
}


        // =========================================
        // CONTINUE REQUEST
        // =========================================

        filterChain.doFilter(
                request,
                response
        );
    }
}