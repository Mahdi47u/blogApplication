package com.mahdi.blogApp.feature.media.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "storage.minio")
public class MinioStorageProperties {

    private String endpoint;

    private String accessKey;

    private String secretKey;

    private String bucket;

    private String publicUrl;
}
