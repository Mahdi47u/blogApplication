package com.mahdi.blogApp.feature.media.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class StoredObject {

    private String bucket;

    private String objectKey;

    private String publicUrl;
}
