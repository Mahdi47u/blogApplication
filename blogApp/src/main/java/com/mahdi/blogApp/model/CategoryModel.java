package com.mahdi.blogApp.model;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CategoryModel {
    public String name;
    public String description;
    public Long postId;
}
