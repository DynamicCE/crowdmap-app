package com.crowdmap.service;

import com.crowdmap.model.Comment;
import com.crowdmap.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class CommentService {
    
    private final CommentRepository commentRepository;
    
    public Comment createComment(Comment comment) {
        return commentRepository.save(comment);
    }
    
    public List<Comment> findByLocationId(Long locationId) {
        return commentRepository.findByLocationIdOrderByCreatedAtDesc(locationId);
    }
    
    public List<Comment> findByUserId(Long userId) {
        return commentRepository.findByUserId(userId);
    }
    
    public Optional<Comment> findById(Long id) {
        return commentRepository.findById(id);
    }
    
    public Comment updateComment(Long id, Comment commentDetails) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
                
        if (commentDetails.getText() != null) {
            comment.setText(commentDetails.getText());
        }
        if (commentDetails.getRating() != null) {
            comment.setRating(commentDetails.getRating());
        }
        
        return commentRepository.save(comment);
    }
    
    public void deleteComment(Long id) {
        commentRepository.deleteById(id);
    }
    
    public boolean isOwner(Long commentId, Long userId) {
        Optional<Comment> comment = commentRepository.findById(commentId);
        return comment.isPresent() && comment.get().getUser().getId().equals(userId);
    }
}