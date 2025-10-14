package com.mahdi.blogApp.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "category")
public class CategoryEntity extends BaseEntity {

    @Column(nullable = false, unique = true, length = 50, name = "category")
    private String name;

    @Column(name = "description")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    private PostEntity post;


    public void assignPost(PostEntity post) {
        this.post = post;
    }

}
