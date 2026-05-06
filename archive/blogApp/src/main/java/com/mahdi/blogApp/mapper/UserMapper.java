package com.mahdi.blogApp.mapper;


import com.mahdi.blogApp.model.UserModel;
import com.mahdi.blogApp.entity.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = {PostMapper.class})
public interface UserMapper {
    @Mapping(source = "roles", target = "roles")
    UserModel toModel(UserEntity userEntity);

    @Mapping(source = "roles", target = "roles")
    UserEntity toEntity(UserModel userModel);
    List<UserModel> toUserModelList(List<UserEntity> userEntities);
}
