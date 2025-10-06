package com.shangrila.slpp.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SignPetitionDTO {

	
	private Long petitionId;

	private Long petitionerId;

	private String title;

	private String content;

	private String status; 

	private String response; 

    private int signatureCount;
	
    private int signatureThreshold;
}
