package com.mahdi.blogApp.feature.admin.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminActionResponse {

    private String title;

    private String description;

    private String path;
}
