package com.shangrila.slpp.dto;

import com.shangrila.slpp.enums.Role;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {

	private String access_token;
	
	private Role role;
	
	private Long userId;
	
	private String fullName;
	
}
