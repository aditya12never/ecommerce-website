package com.ecommerce.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.entity.Product;
import com.ecommerce.service.ProductService;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    private final ProductService productService;

    public ProductController(
            ProductService productService
    ) {
        this.productService = productService;
    }

    // ==============================
    // GET ALL PRODUCTS
    // ==============================
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {

        return ResponseEntity.ok(
                productService.getAllProducts()
        );
    }

    // ==============================
    // GET PRODUCT BY ID
    // ==============================
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(
            @PathVariable Long id
    ) {

        return productService
                .getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(
                        ResponseEntity
                                .notFound()
                                .build()
                );
    }

    // ==============================
    // CREATE PRODUCT
    // ADMIN ONLY
    // ==============================
    @PostMapping
    public ResponseEntity<Product> addProduct(
            @RequestBody Product product
    ) {

        return ResponseEntity.ok(
                productService.addProduct(product)
        );
    }

    // ==============================
    // UPDATE PRODUCT
    // ADMIN ONLY
    // ==============================
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @RequestBody Product product
    ) {

        return ResponseEntity.ok(
                productService.updateProduct(
                        id,
                        product
                )
        );
    }

    // ==============================
    // DELETE PRODUCT
    // ADMIN ONLY
    // ==============================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(
            @PathVariable Long id
    ) {

        productService.deleteProduct(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}