package com.mahdi.blogApp.feature.post.entity;

import com.mahdi.blogApp.feature.BaseEntity;
import com.mahdi.blogApp.feature.category.entity.CategoryEntity;
import com.mahdi.blogApp.feature.comment.entity.CommentEntity;
import com.mahdi.blogApp.feature.user.entity.UserEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.List;
import java.util.Set;


@Entity
@Table(name = "posts")
@Getter
@Setter
public class PostEntity extends BaseEntity {

    @Column(nullable = false, length = 150)
    private String title;

    @Column(columnDefinition = "text")
    private String content;

    private String coverImageUrl;

    private String thumbnailUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false, updatable = false)
    private UserEntity author;

    @ManyToMany
    @JoinTable(
            name = "post_categories",
            joinColumns = @JoinColumn(name = "post_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private Set<CategoryEntity> categories = new HashSet<>();


    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
    private List<CommentEntity> comments;
}

