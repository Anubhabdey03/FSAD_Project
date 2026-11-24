package com.ebaazee.repository;

import com.ebaazee.entity.Product;
import com.ebaazee.entity.Purchase;
import com.ebaazee.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
    Optional<Purchase> findByProduct(Product product);
    List<Purchase> findByUser(User user);
}
