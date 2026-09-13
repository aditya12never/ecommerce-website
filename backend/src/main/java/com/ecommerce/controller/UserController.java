package com.ecommerce.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.dto.UserResponse;
import com.ecommerce.entity.User;
import com.ecommerce.service.JwtService;
import com.ecommerce.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;

    public UserController(
            UserService userService,
            JwtService jwtService
    ) {
        this.userService = userService;
        this.jwtService = jwtService;
    }


    // ==============================
    // REGISTER
    // ==============================
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(
            @RequestBody User user
    ) {

        try {

            User registeredUser =
                    userService.registerUser(user);

            UserResponse response =
                    new UserResponse(
                            registeredUser.getId(),
                            registeredUser.getName(),
                            registeredUser.getEmail(),
                            registeredUser.getRole()
                    );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(response);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }


    // ==============================
    // LOGIN
    // ==============================
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(
            @RequestBody User user
    ) {

        try {

            User loggedInUser =
                    userService.loginUser(
                            user.getEmail(),
                            user.getPassword()
                    );


            // Generate JWT containing:
            // email + role
            String token =
                    jwtService.generateToken(
                            loggedInUser
                    );


            // User information sent to frontend
            UserResponse userResponse =
                    new UserResponse(
                            loggedInUser.getId(),
                            loggedInUser.getName(),
                            loggedInUser.getEmail(),
                            loggedInUser.getRole()
                    );


            return ResponseEntity.ok(
                    Map.of(
                            "token",
                            token,
                            "user",
                            userResponse
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }


    // ==============================
    // PROFILE
    // ==============================
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {

        try {

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "JWT authentication successful"
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }
}