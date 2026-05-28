package com.mahdi.blogApp.feature.user.mapper;



import com.mahdi.blogApp.feature.user.model.UserModel;
import com.mahdi.blogApp.feature.user.model.ProfileResponse;
import com.mahdi.blogApp.feature.user.entity.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

//@Mapper(
//    componentModel = "spring",
//    unmappedTargetPolicy = ReportingPolicy.IGNORE,
//    uses = {PostMapper.class}
//)

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {

    // ENTITY → MODEL
    @Mapping(target = "password", ignore = true)
    UserModel toModel(UserEntity entity);

    ProfileResponse toProfileResponse(UserEntity entity);

    // MODEL → ENTITY (CREATE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", ignore = true) // we will set password manually in service
    UserEntity toEntity(UserModel model);

    List<UserModel> toUserModelList(List<UserEntity> entities);

}

