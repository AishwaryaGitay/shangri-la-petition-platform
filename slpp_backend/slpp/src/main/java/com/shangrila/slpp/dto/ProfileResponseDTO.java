package com.shangrila.slpp.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProfileResponseDTO {

	
	private String title;
    private String content;
    private int signatures;
    private String status;
    private String response;
    
    
}
