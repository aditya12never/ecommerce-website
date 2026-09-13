package com.ecommerce.dto;

public class UserResponse {

    private Long id;

    private String name;

    private String email;

    private String role;


    // ==============================
    // DEFAULT CONSTRUCTOR
    // ==============================
    public UserResponse() {
    }


    // ==============================
    // CONSTRUCTOR
    // ==============================
    public UserResponse(
            Long id,
            String name,
            String email,
            String role
    ) {

        this.id = id;

        this.name = name;

        this.email = email;

        this.role = role;
    }


    // ==============================
    // GET ID
    // ==============================
    public Long getId() {

        return id;
    }


    // ==============================
    // SET ID
    // ==============================
    public void setId(Long id) {

        this.id = id;
    }


    // ==============================
    // GET NAME
    // ==============================
    public String getName() {

        return name;
    }


    // ==============================
    // SET NAME
    // ==============================
    public void setName(String name) {

        this.name = name;
    }


    // ==============================
    // GET EMAIL
    // ==============================
    public String getEmail() {

        return email;
    }


    // ==============================
    // SET EMAIL
    // ==============================
    public void setEmail(String email) {

        this.email = email;
    }


    // ==============================
    // GET ROLE
    // ==============================
    public String getRole() {

        return role;
    }


    // ==============================
    // SET ROLE
    // ==============================
    public void setRole(String role) {

        this.role = role;
    }
}