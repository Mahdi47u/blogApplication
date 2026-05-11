package com.mahdi.blogApp.feature.comment.entity;

import com.mahdi.blogApp.feature.BaseEntity;
import com.mahdi.blogApp.feature.user.entity.UserEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "comment_likes",
        uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "comment_id"})
} )
public class CommentLikeEntity extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @ManyToOne
    @JoinColumn(name = "comment_id", nullable = false)
    private CommentEntity comment;
}
