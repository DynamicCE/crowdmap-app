package com.crowdmap.repository;

import com.crowdmap.model.Location;
import com.crowdmap.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
    
    List<Location> findByCategory(Category category);
    
    List<Location> findByUserId(Long userId);
    
    @Query("SELECT l FROM Location l WHERE " +
           "(6371 * acos(cos(radians(:lat)) * cos(radians(l.latitude)) * " +
           "cos(radians(l.longitude) - radians(:lng)) + sin(radians(:lat)) * " +
           "sin(radians(l.latitude)))) < :radius")
    List<Location> findLocationsWithinRadius(@Param("lat") Double latitude, 
                                           @Param("lng") Double longitude, 
                                           @Param("radius") Double radius);
    
    @Query("SELECT l FROM Location l WHERE " +
           "(6371 * acos(cos(radians(:lat)) * cos(radians(l.latitude)) * " +
           "cos(radians(l.longitude) - radians(:lng)) + sin(radians(:lat)) * " +
           "sin(radians(l.latitude)))) < :radius AND l.category.id = :categoryId")
    List<Location> findLocationsWithinRadiusByCategory(@Param("lat") Double latitude, 
                                                      @Param("lng") Double longitude, 
                                                      @Param("radius") Double radius,
                                                      @Param("categoryId") Long categoryId);
}