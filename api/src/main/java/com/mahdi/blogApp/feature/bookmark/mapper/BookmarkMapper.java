package com.mahdi.blogApp.feature.bookmark.mapper;

import com.mahdi.blogApp.feature.bookmark.entity.BookmarkEntity;
import com.mahdi.blogApp.feature.bookmark.model.BookmarkResponse;
import com.mahdi.blogApp.feature.post.mapper.PostMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(
        componentModel = "spring",
        uses = PostMapper.class,
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface BookmarkMapper {

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "post", target = "post")
    BookmarkResponse toResponse(BookmarkEntity bookmarkEntity);
}
