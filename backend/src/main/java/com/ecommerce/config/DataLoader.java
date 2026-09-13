package com.ecommerce.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.ecommerce.entity.Product;
import com.ecommerce.repository.ProductRepository;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner loadProducts(ProductRepository productRepository) {
        return args -> {

            if (productRepository.count() == 0) {

                productRepository.save(
                    new Product(
                        "Wireless Headphones",
                        "Electronics",
                        2499.0,
                        3999.0,
                        "https://via.placeholder.com/500",
                        4.8,
                        125,
                        "Premium wireless headphones with clear sound and comfortable design.",
                        50,
                        38
                    )
                );

                productRepository.save(
                    new Product(
                        "Smart Watch",
                        "Electronics",
                        1999.0,
                        2999.0,
                        "https://via.placeholder.com/500",
                        4.6,
                        98,
                        "Smart watch with fitness tracking and multiple useful features.",
                        40,
                        33
                    )
                );

                productRepository.save(
                    new Product(
                        "Running Shoes",
                        "Fashion",
                        1799.0,
                        2499.0,
                        "https://via.placeholder.com/500",
                        4.7,
                        76,
                        "Lightweight running shoes designed for everyday comfort.",
                        35,
                        28
                    )
                );

                System.out.println("ShopZone products inserted successfully!");

            } else {
                System.out.println("Products already exist. Skipping data insertion.");
            }
        };
    }
}