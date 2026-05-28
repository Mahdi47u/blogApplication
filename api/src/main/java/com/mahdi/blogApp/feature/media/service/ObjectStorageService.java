package com.mahdi.blogApp.feature.media.service;

import com.mahdi.blogApp.feature.media.model.StoredObject;

import java.io.InputStream;

public interface ObjectStorageService {

    StoredObject upload(
            String objectKey,
            InputStream inputStream,
            long size,
            String contentType
    );

    void delete(String objectKey);
}
