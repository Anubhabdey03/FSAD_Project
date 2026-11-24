package com.ebaazee.repository;

import com.ebaazee.entity.Category;
import com.ebaazee.entity.Product;
import com.ebaazee.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(Category category);
    List<Product> findBySeller(User seller);
}
