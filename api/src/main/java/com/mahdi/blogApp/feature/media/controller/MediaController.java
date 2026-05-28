package com.mahdi.blogApp.feature.media.controller;

import com.mahdi.blogApp.feature.media.model.MediaAssetResponse;
import com.mahdi.blogApp.feature.media.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
public class MediaController {

    private final MediaService mediaService;

    @PostMapping(value = "/posts/{postId}/cover", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('SUPERADMIN')")
    public ResponseEntity<MediaAssetResponse> uploadPostCover(
            @PathVariable Long postId,
            @RequestParam("file") MultipartFile file
    ) {

        return ResponseEntity.ok(mediaService.uploadPostCover(postId, file));
    }

    @DeleteMapping("/posts/{postId}/cover")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('SUPERADMIN')")
    public ResponseEntity<Void> deletePostCover(@PathVariable Long postId) {

        mediaService.deletePostCover(postId);

        return ResponseEntity.noContent().build();
    }
}
