package com.ebaazee.repository;

import com.ebaazee.entity.Bid;
import com.ebaazee.entity.Product;
import com.ebaazee.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BidRepository extends JpaRepository<Bid, Long> {
    Optional<Bid> findByUserAndProduct(User user, Product product);
    List<Bid> findByProduct(Product product);
    long countByProduct(Product product);
    List<Bid> findByUser(User user);
}
