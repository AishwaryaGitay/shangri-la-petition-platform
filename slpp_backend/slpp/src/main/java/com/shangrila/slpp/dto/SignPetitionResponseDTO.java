package com.shangrila.slpp.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SignPetitionResponseDTO {

	
	private Long petitionId;

	private Long petitionerId;
	
	private String message;
	
	private String status; 

    private int signatureCount;
	
    private int signatureThreshold;
}
