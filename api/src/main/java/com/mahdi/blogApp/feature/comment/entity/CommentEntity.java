package com.mahdi.blogApp.feature.comment.entity;

import com.mahdi.blogApp.feature.BaseEntity;
import com.mahdi.blogApp.feature.post.entity.PostEntity;
import com.mahdi.blogApp.feature.user.entity.UserEntity;
import com.mahdi.blogApp.feature.comment.entity.CommentLikeEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "comments")
public class CommentEntity extends BaseEntity {


    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false)
    private PostEntity post;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    private CommentEntity parent;

    @Column(nullable = false, length = 1000)
    private String text;

    private int likeCount = 0;

    private boolean approved = true;

    private boolean edited = false;

    @OneToMany(mappedBy = "comment", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<CommentLikeEntity> likes;
}
