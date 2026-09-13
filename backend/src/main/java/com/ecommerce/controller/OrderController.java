package com.ecommerce.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.entity.Order;
import com.ecommerce.service.OrderService;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }


    // ==========================================
    // GET ALL ORDERS
    // ADMIN
    // ==========================================

    @GetMapping
    public List<Order> getAllOrders() {

        return orderService.getAllOrders();
    }


    // ==========================================
    // GET MY ORDERS
    // USER / ADMIN
    // ==========================================

    @GetMapping("/my-orders")
    public List<Order> getMyOrders(
            Authentication authentication
    ) {

        String email = authentication.getName();

        return orderService.getOrdersByEmail(email);
    }


    // ==========================================
    // GET ORDER BY ID
    // USER / ADMIN
    // ==========================================

    @GetMapping("/{id}")
    public Order getOrderById(
            @PathVariable Long id,
            Authentication authentication
    ) {

        String email = authentication.getName();

        return orderService.getOrderById(
                id,
                email
        );
    }


    // ==========================================
    // CREATE ORDER
    // AUTHENTICATED USER
    // ==========================================

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Order createOrder(
            @RequestBody Order order,
            Authentication authentication
    ) {

        String authenticatedEmail =
                authentication.getName();

        return orderService.createOrder(
                order,
                authenticatedEmail
        );
    }


    // ==========================================
    // UPDATE ORDER STATUS
    // ADMIN ONLY
    // ==========================================

    @PutMapping("/{id}/status")
    public Order updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request
    ) {

        if (request == null ||
                request.get("status") == null) {

            throw new RuntimeException(
                    "Order status is required"
            );
        }

        String status =
                request.get("status");

        return orderService.updateOrderStatus(
                id,
                status
        );
    }


    // ==========================================
    // CANCEL ORDER
    // USER / OWNER
    // ==========================================

    @PutMapping("/{id}/cancel")
    public Order cancelOrder(
            @PathVariable Long id,
            Authentication authentication
    ) {

        String email =
                authentication.getName();

        return orderService.cancelOrder(
                id,
                email
        );
    }


    // ==========================================
    // DELETE ORDER
    // USER / OWNER
    // ONLY CANCELLED ORDERS
    // ==========================================

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteOrder(
            @PathVariable Long id,
            Authentication authentication
    ) {

        String email =
                authentication.getName();

        orderService.deleteOrder(
                id,
                email
        );
    }
}