package com.crowdmap.repository;

import com.crowdmap.model.Photo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhotoRepository extends JpaRepository<Photo, Long> {
    
    List<Photo> findByLocationId(Long locationId);
    
    List<Photo> findByUploadedById(Long userId);
}