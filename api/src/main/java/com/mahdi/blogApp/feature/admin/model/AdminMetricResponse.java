package com.mahdi.blogApp.feature.admin.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminMetricResponse {

    private String label;

    private long value;

    private String description;
}
