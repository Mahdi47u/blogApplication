package com.mahdi.blogApp.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "comment")
public class CommentEntity extends BaseEntity {
    @Column(nullable = false, length = 255, name = "text")
    private String content;

    @ManyToOne
    @JoinColumn(name = "post_id")
    private PostEntity post;

    @ManyToOne
    @JoinColumn(name = "author_id")
    private UserEntity author;

    @Column(nullable = false, name = "is_approved")
    private boolean isApproved = false;

    @Column(nullable = false, name = "created_at")
    private LocalDateTime createdAt;

    @Column(nullable = false, name = "updated_at")
    private LocalDateTime updatedAt;


    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void assignPost(PostEntity post) {
        this.post = post;
    }

    public void assignAuthor(UserEntity author) {
        this.author = author;
    }



}
