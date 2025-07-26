package com.crowdmap.service;

import com.crowdmap.model.Location;
import com.crowdmap.model.Category;
import com.crowdmap.model.User;
import com.crowdmap.repository.LocationRepository;
import com.crowdmap.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class LocationService {
    
    private final LocationRepository locationRepository;
    private final CategoryRepository categoryRepository;
    
    public Location createLocation(Location location) {
        return locationRepository.save(location);
    }
    
    public List<Location> findAll() {
        return locationRepository.findAll();
    }
    
    public Optional<Location> findById(Long id) {
        return locationRepository.findById(id);
    }
    
    public List<Location> findByCategory(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        return locationRepository.findByCategory(category);
    }
    
    public List<Location> findByUserId(Long userId) {
        return locationRepository.findByUserId(userId);
    }
    
    public List<Location> findLocationsNearby(Double latitude, Double longitude, Double radius) {
        return locationRepository.findLocationsWithinRadius(latitude, longitude, radius);
    }
    
    public List<Location> findLocationsNearbyByCategory(Double latitude, Double longitude, 
                                                       Double radius, Long categoryId) {
        return locationRepository.findLocationsWithinRadiusByCategory(latitude, longitude, 
                                                                     radius, categoryId);
    }
    
    public Location updateLocation(Long id, Location locationDetails) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Location not found"));
                
        if (locationDetails.getTitle() != null) {
            location.setTitle(locationDetails.getTitle());
        }
        if (locationDetails.getDescription() != null) {
            location.setDescription(locationDetails.getDescription());
        }
        if (locationDetails.getLatitude() != null) {
            location.setLatitude(locationDetails.getLatitude());
        }
        if (locationDetails.getLongitude() != null) {
            location.setLongitude(locationDetails.getLongitude());
        }
        if (locationDetails.getCategory() != null) {
            location.setCategory(locationDetails.getCategory());
        }
        
        return locationRepository.save(location);
    }
    
    public void deleteLocation(Long id) {
        locationRepository.deleteById(id);
    }
    
    public boolean isOwner(Long locationId, Long userId) {
        Optional<Location> location = locationRepository.findById(locationId);
        return location.isPresent() && location.get().getUser().getId().equals(userId);
    }
}