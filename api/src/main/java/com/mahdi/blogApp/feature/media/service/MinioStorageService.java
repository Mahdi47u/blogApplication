package com.mahdi.blogApp.feature.media.service;

import com.mahdi.blogApp.feature.media.config.MinioStorageProperties;
import com.mahdi.blogApp.feature.media.model.StoredObject;
import io.minio.*;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.InputStream;

@Service
@RequiredArgsConstructor
public class MinioStorageService implements ObjectStorageService {

    private final MinioClient minioClient;
    private final MinioStorageProperties properties;

    @PostConstruct
    public void ensureBucketExists() {
        try {
            boolean exists = minioClient.bucketExists(
                    BucketExistsArgs.builder()
                            .bucket(properties.getBucket())
                            .build()
            );

            if (!exists) {
                minioClient.makeBucket(
                        MakeBucketArgs.builder()
                                .bucket(properties.getBucket())
                                .build()
                );
            }

            minioClient.setBucketPolicy(
                    SetBucketPolicyArgs.builder()
                            .bucket(properties.getBucket())
                            .config(publicReadPolicy())
                            .build()
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to initialize MinIO bucket", e);
        }
    }

    @Override
    public StoredObject upload(
            String objectKey,
            InputStream inputStream,
            long size,
            String contentType
    ) {
        try {
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(properties.getBucket())
                            .object(objectKey)
                            .stream(inputStream, size, -1)
                            .contentType(contentType)
                            .build()
            );

            return new StoredObject(
                    properties.getBucket(),
                    objectKey,
                    properties.getPublicUrl() + "/" + objectKey
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload media", e);
        }
    }

    @Override
    public void delete(String objectKey) {

        if (objectKey == null || objectKey.isBlank()) {
            return;
        }

        try {
            minioClient.removeObject(
                    RemoveObjectArgs.builder()
                            .bucket(properties.getBucket())
                            .object(objectKey)
                            .build()
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete media", e);
        }
    }

    private String publicReadPolicy() {
        return """
                {
                  "Version": "2012-10-17",
                  "Statement": [
                    {
                      "Effect": "Allow",
                      "Principal": {"AWS": ["*"]},
                      "Action": ["s3:GetObject"],
                      "Resource": ["arn:aws:s3:::%s/*"]
                    }
                  ]
                }
                """.formatted(properties.getBucket());
    }
}
