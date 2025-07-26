package com.crowdmap.controller;

import com.crowdmap.model.Comment;
import com.crowdmap.model.Location;
import com.crowdmap.model.User;
import com.crowdmap.service.CommentService;
import com.crowdmap.service.LocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin
public class CommentController {
    
    private final CommentService commentService;
    private final LocationService locationService;
    
    @GetMapping("/locations/{locationId}/comments")
    public ResponseEntity<List<Comment>> getLocationComments(@PathVariable Long locationId) {
        List<Comment> comments = commentService.findByLocationId(locationId);
        return ResponseEntity.ok(comments);
    }
    
    @PostMapping("/locations/{locationId}/comments")
    public ResponseEntity<Comment> createComment(
            @PathVariable Long locationId,
            @RequestBody CommentRequest commentRequest,
            @AuthenticationPrincipal User currentUser) {
        
        Location location = locationService.findById(locationId)
                .orElseThrow(() -> new RuntimeException("Location not found"));
        
        Comment comment = new Comment();
        comment.setLocation(location);
        comment.setUser(currentUser);
        comment.setText(commentRequest.getText());
        comment.setRating(commentRequest.getRating());
        
        Comment createdComment = commentService.createComment(comment);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdComment);
    }
    
    @PutMapping("/comments/{id}")
    public ResponseEntity<Comment> updateComment(
            @PathVariable Long id,
            @RequestBody CommentRequest commentRequest,
            @AuthenticationPrincipal User currentUser) {
        
        if (!commentService.isOwner(id, currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        Comment comment = new Comment();
        comment.setText(commentRequest.getText());
        comment.setRating(commentRequest.getRating());
        
        Comment updatedComment = commentService.updateComment(id, comment);
        return ResponseEntity.ok(updatedComment);
    }
    
    @DeleteMapping("/comments/{id}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        
        if (!commentService.isOwner(id, currentUser.getId()) && 
            !currentUser.getRole().equals(User.Role.ADMIN)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        commentService.deleteComment(id);
        return ResponseEntity.noContent().build();
    }
    
    static class CommentRequest {
        private String text;
        private Integer rating;
        
        public String getText() { return text; }
        public void setText(String text) { this.text = text; }
        public Integer getRating() { return rating; }
        public void setRating(Integer rating) { this.rating = rating; }
    }
}