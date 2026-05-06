package com.mahdi.blogApp.controller;

import com.mahdi.blogApp.model.CommentModel;
import com.mahdi.blogApp.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<CommentModel> createComment(@RequestBody CommentModel comment) {
        CommentModel createdComment = commentService.createComment(comment);
        return ResponseEntity.ok(createdComment);
    }

    @PutMapping("/{commentId}/approve")
    public ResponseEntity<CommentModel> approveComment(@PathVariable Long commentId
                                                    , @RequestBody Long adminId) {
        CommentModel approvedComment = commentService.approveComment(commentId, adminId);
        return ResponseEntity.ok(approvedComment);

    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId) {
        commentService.deleteComment(commentId);
        return ResponseEntity.noContent().build();
    }


}
