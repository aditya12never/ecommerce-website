package com.ecommerce.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ecommerce.entity.User;
import com.ecommerce.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ==============================
    // REGISTER USER
    // ==============================
    public User registerUser(User user) {

        // Check email
        if (user.getEmail() == null ||
                user.getEmail().isBlank()) {

            throw new RuntimeException(
                    "Email is required"
            );
        }

        // Check password
        if (user.getPassword() == null ||
                user.getPassword().isBlank()) {

            throw new RuntimeException(
                    "Password is required"
            );
        }

        // Normalize email
        String email = user.getEmail()
                .trim()
                .toLowerCase();

        // Check duplicate email
        if (userRepository.existsByEmail(email)) {

            throw new RuntimeException(
                    "Email already registered"
            );
        }

        // Save normalized email
        user.setEmail(email);

        // Hash password using BCrypt
        String hashedPassword =
                passwordEncoder.encode(
                        user.getPassword()
                );

        user.setPassword(hashedPassword);

        // Every newly registered user
        // gets USER role by default
        user.setRole("USER");

        // Save user to database
        return userRepository.save(user);
    }


    // ==============================
    // LOGIN USER
    // ==============================
    public User loginUser(
            String email,
            String password
    ) {

        // Validate email and password
        if (email == null ||
                email.isBlank() ||
                password == null ||
                password.isBlank()) {

            throw new RuntimeException(
                    "Email and password are required"
            );
        }

        // Normalize email
        String normalizedEmail = email
                .trim()
                .toLowerCase();

        // Find user by email
        User user = userRepository
                .findByEmail(normalizedEmail)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invalid email or password"
                        )
                );

        // Compare entered password
        // with BCrypt hashed password
        boolean passwordMatches =
                passwordEncoder.matches(
                        password,
                        user.getPassword()
                );

        if (!passwordMatches) {

            throw new RuntimeException(
                    "Invalid email or password"
            );
        }

        // Login successful
        return user;
    }


    // ==============================
    // GET USER BY EMAIL
    // ==============================
    public User getUserByEmail(
            String email
    ) {

        if (email == null ||
                email.isBlank()) {

            throw new RuntimeException(
                    "Email is required"
            );
        }

        return userRepository
                .findByEmail(
                        email.trim().toLowerCase()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );
    }
}