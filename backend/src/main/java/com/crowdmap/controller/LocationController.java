package com.crowdmap.controller;

import com.crowdmap.model.Location;
import com.crowdmap.model.User;
import com.crowdmap.service.LocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
@RequiredArgsConstructor
@CrossOrigin
public class LocationController {
    
    private final LocationService locationService;
    
    @GetMapping
    public ResponseEntity<List<Location>> getLocations(
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lng,
            @RequestParam(defaultValue = "10") Double radius,
            @RequestParam(required = false) Long category) {
        
        List<Location> locations;
        
        if (lat != null && lng != null) {
            if (category != null) {
                locations = locationService.findLocationsNearbyByCategory(lat, lng, radius, category);
            } else {
                locations = locationService.findLocationsNearby(lat, lng, radius);
            }
        } else if (category != null) {
            locations = locationService.findByCategory(category);
        } else {
            locations = locationService.findAll();
        }
        
        return ResponseEntity.ok(locations);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Location> getLocation(@PathVariable Long id) {
        return locationService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Location> createLocation(
            @RequestBody Location location,
            @AuthenticationPrincipal User currentUser) {
        
        location.setUser(currentUser);
        Location createdLocation = locationService.createLocation(location);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdLocation);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Location> updateLocation(
            @PathVariable Long id,
            @RequestBody Location location,
            @AuthenticationPrincipal User currentUser) {
        
        if (!locationService.isOwner(id, currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        Location updatedLocation = locationService.updateLocation(id, location);
        return ResponseEntity.ok(updatedLocation);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLocation(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        
        if (!locationService.isOwner(id, currentUser.getId()) && 
            !currentUser.getRole().equals(User.Role.ADMIN)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        locationService.deleteLocation(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Location>> getUserLocations(@PathVariable Long userId) {
        List<Location> locations = locationService.findByUserId(userId);
        return ResponseEntity.ok(locations);
    }
}