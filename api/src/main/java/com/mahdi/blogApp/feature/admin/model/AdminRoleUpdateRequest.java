package com.mahdi.blogApp.feature.admin.model;

import com.mahdi.blogApp.feature.user.entity.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminRoleUpdateRequest {

    private Role role;
}
