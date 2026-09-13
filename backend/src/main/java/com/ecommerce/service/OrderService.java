package com.ecommerce.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ecommerce.entity.Order;
import com.ecommerce.entity.OrderItem;
import com.ecommerce.entity.Product;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.ProductRepository;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public OrderService(
            OrderRepository orderRepository,
            ProductRepository productRepository
    ) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    // ==========================================
    // GET ALL ORDERS
    // ==========================================

    public List<Order> getAllOrders() {

        return orderRepository.findAll();
    }


    // ==========================================
    // GET ORDERS BY EMAIL
    // ==========================================

    public List<Order> getOrdersByEmail(String email) {

        if (email == null || email.isBlank()) {

            throw new RuntimeException(
                    "Email is required"
            );
        }

        return orderRepository.findByEmail(
                email.trim().toLowerCase()
        );
    }


    // ==========================================
    // GET ORDER BY ID
    // ==========================================

    public Order getOrderById(
            Long id,
            String email
    ) {

        if (email == null || email.isBlank()) {

            throw new RuntimeException(
                    "Email is required"
            );
        }

        Order order = orderRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Order not found"
                        )
                );

        if (!order.getEmail()
                .equalsIgnoreCase(
                        email.trim()
                )) {

            throw new RuntimeException(
                    "You are not authorized to view this order"
            );
        }

        return order;
    }


    // ==========================================
    // CREATE ORDER
    // ==========================================

    @Transactional
    public Order createOrder(
            Order order,
            String authenticatedEmail
    ) {

        if (authenticatedEmail == null ||
                authenticatedEmail.isBlank()) {

            throw new RuntimeException(
                    "Authenticated user is required"
            );
        }

        String normalizedEmail =
                authenticatedEmail
                        .trim()
                        .toLowerCase();

        // Always use the authenticated user's email
        order.setEmail(normalizedEmail);

        // Every newly created order starts as PLACED
        order.setStatus("PLACED");


        // ==========================================
        // VALIDATE ITEMS
        // ==========================================

        if (order.getItems() == null ||
                order.getItems().isEmpty()) {

            throw new RuntimeException(
                    "Order must contain at least one item"
            );
        }


        // ==========================================
        // PROCESS EACH ITEM
        // ==========================================

        for (OrderItem item : order.getItems()) {

            if (item.getProductId() == null) {

                throw new RuntimeException(
                        "Product ID is required"
                );
            }

            if (item.getQuantity() <= 0) {

                throw new RuntimeException(
                        "Product quantity must be greater than zero"
                );
            }


            Product product =
                    productRepository
                            .findById(
                                    item.getProductId()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Product not found: "
                                                    + item.getProductId()
                                    )
                            );


            // ==========================================
            // CHECK STOCK
            // ==========================================

            if (product.getStock() <
                    item.getQuantity()) {

                throw new RuntimeException(
                        "Insufficient stock for product: "
                                + product.getTitle()
                                + ". Available stock: "
                                + product.getStock()
                );
            }


            // ==========================================
            // DECREASE STOCK
            // ==========================================

            int remainingStock =
                    product.getStock()
                            - item.getQuantity();

            product.setStock(
                    remainingStock
            );

            productRepository.save(
                    product
            );


            // Connect item to order
            item.setOrder(order);
        }


        return orderRepository.save(order);
    }


    // ==========================================
    // UPDATE ORDER STATUS
    // ADMIN ONLY
    // ==========================================

    @Transactional
    public Order updateOrderStatus(
            Long id,
            String status
    ) {

        if (status == null ||
                status.isBlank()) {

            throw new RuntimeException(
                    "Order status is required"
            );
        }


        Order order = orderRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Order not found"
                        )
                );


        String currentStatus =
                order.getStatus() == null
                        ? "PLACED"
                        : order.getStatus()
                                .trim()
                                .toUpperCase();


        String newStatus =
                status.trim().toUpperCase();


        validateStatus(newStatus);


        // ==========================================
        // NO CHANGE
        // ==========================================

        if (currentStatus.equals(newStatus)) {

            return order;
        }


        // ==========================================
        // CANCELLED ORDER
        // ==========================================

        if (currentStatus.equals("CANCELLED")) {

            throw new RuntimeException(
                    "Cancelled orders cannot be changed"
            );
        }


        // ==========================================
        // PREVENT INVALID STATUS MOVEMENT
        // ==========================================

        validateStatusTransition(
                currentStatus,
                newStatus
        );


        // ==========================================
        // ADMIN CANCELLATION
        // RESTORE STOCK
        // ==========================================

        if (newStatus.equals("CANCELLED")) {

            restoreOrderStock(order);
        }


        // ==========================================
        // UPDATE STATUS
        // ==========================================

        order.setStatus(newStatus);

        return orderRepository.save(order);
    }


    // ==========================================
    // CANCEL ORDER
    // USER / OWNER
    // RESTORE STOCK
    // ==========================================

    @Transactional
    public Order cancelOrder(
            Long id,
            String email
    ) {

        if (email == null ||
                email.isBlank()) {

            throw new RuntimeException(
                    "Email is required"
            );
        }


        Order order = orderRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Order not found"
                        )
                );


        // ==========================================
        // CHECK OWNERSHIP
        // ==========================================

        if (!order.getEmail()
                .equalsIgnoreCase(
                        email.trim()
                )) {

            throw new RuntimeException(
                    "You are not authorized to cancel this order"
            );
        }


        String currentStatus =
                order.getStatus() == null
                        ? "PLACED"
                        : order.getStatus()
                                .trim()
                                .toUpperCase();


        // ==========================================
        // ALREADY CANCELLED
        // ==========================================

        if (currentStatus.equals("CANCELLED")) {

            throw new RuntimeException(
                    "This order is already cancelled"
            );
        }


        // ==========================================
        // SHIPPED CANNOT BE CANCELLED
        // ==========================================

        if (currentStatus.equals("SHIPPED")) {

            throw new RuntimeException(
                    "Shipped orders cannot be cancelled"
            );
        }


        // ==========================================
        // DELIVERED CANNOT BE CANCELLED
        // ==========================================

        if (currentStatus.equals("DELIVERED")) {

            throw new RuntimeException(
                    "Delivered orders cannot be cancelled"
            );
        }


        // ==========================================
        // ONLY PLACED / PROCESSING
        // ==========================================

        if (!currentStatus.equals("PLACED") &&
                !currentStatus.equals("PROCESSING")) {

            throw new RuntimeException(
                    "This order cannot be cancelled"
            );
        }


        // ==========================================
        // RESTORE STOCK
        // ==========================================

        restoreOrderStock(order);


        // ==========================================
        // CHANGE STATUS
        // ==========================================

        order.setStatus("CANCELLED");

        return orderRepository.save(order);
    }


    // ==========================================
    // RESTORE ORDER STOCK
    // ==========================================

    private void restoreOrderStock(Order order) {

        if (order.getItems() == null ||
                order.getItems().isEmpty()) {

            throw new RuntimeException(
                    "Order contains no items"
            );
        }


        for (OrderItem item :
                order.getItems()) {

            if (item.getProductId() == null) {

                throw new RuntimeException(
                        "Product ID is missing from order item"
                );
            }


            if (item.getQuantity() <= 0) {

                throw new RuntimeException(
                        "Invalid quantity in order item"
                );
            }


            Product product =
                    productRepository
                            .findById(
                                    item.getProductId()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Product not found: "
                                                    + item.getProductId()
                                    )
                            );


            int restoredStock =
                    product.getStock()
                            + item.getQuantity();


            product.setStock(
                    restoredStock
            );


            productRepository.save(
                    product
            );
        }
    }


    // ==========================================
    // DELETE ORDER
    // ==========================================

    public void deleteOrder(
            Long id,
            String email
    ) {

        if (email == null ||
                email.isBlank()) {

            throw new RuntimeException(
                    "Email is required"
            );
        }


        Order order = orderRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Order not found"
                        )
                );


        if (!order.getEmail()
                .equalsIgnoreCase(
                        email.trim()
                )) {

            throw new RuntimeException(
                    "You are not authorized to delete this order"
            );
        }


        // ==========================================
        // ONLY CANCELLED ORDERS CAN BE DELETED
        // ==========================================

        String status =
                order.getStatus() == null
                        ? ""
                        : order.getStatus()
                                .trim()
                                .toUpperCase();


        if (!status.equals("CANCELLED")) {

            throw new RuntimeException(
                    "Only cancelled orders can be deleted"
            );
        }


        orderRepository.delete(order);
    }


    // ==========================================
    // VALIDATE STATUS
    // ==========================================

    private void validateStatus(String status) {

        if (!status.equals("PLACED") &&
                !status.equals("PROCESSING") &&
                !status.equals("SHIPPED") &&
                !status.equals("DELIVERED") &&
                !status.equals("CANCELLED")) {

            throw new RuntimeException(
                    "Invalid order status"
            );
        }
    }


    // ==========================================
    // VALIDATE STATUS TRANSITION
    // ==========================================

    private void validateStatusTransition(
            String currentStatus,
            String newStatus
    ) {

        // PLACED
        if (currentStatus.equals("PLACED")) {

            if (!newStatus.equals("PROCESSING") &&
                    !newStatus.equals("CANCELLED")) {

                throw new RuntimeException(
                        "PLACED order can only move to PROCESSING or CANCELLED"
                );
            }

            return;
        }


        // PROCESSING
        if (currentStatus.equals("PROCESSING")) {

            if (!newStatus.equals("SHIPPED") &&
                    !newStatus.equals("CANCELLED")) {

                throw new RuntimeException(
                        "PROCESSING order can only move to SHIPPED or CANCELLED"
                );
            }

            return;
        }


        // SHIPPED
        if (currentStatus.equals("SHIPPED")) {

            if (!newStatus.equals("DELIVERED")) {

                throw new RuntimeException(
                        "SHIPPED order can only move to DELIVERED"
                );
            }

            return;
        }


        // DELIVERED
        if (currentStatus.equals("DELIVERED")) {

            throw new RuntimeException(
                    "Delivered orders cannot be changed"
            );
        }


        throw new RuntimeException(
                "Invalid order status transition"
        );
    }
}