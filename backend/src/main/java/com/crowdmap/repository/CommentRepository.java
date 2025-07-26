package com.crowdmap.repository;

import com.crowdmap.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    
    List<Comment> findByLocationId(Long locationId);
    
    List<Comment> findByUserId(Long userId);
    
    List<Comment> findByLocationIdOrderByCreatedAtDesc(Long locationId);
}