package com.shangrila.slpp.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ResponsePetitionDTO {
	
	    private Long id;
	    private String title;
	    private String content;
	    private String status;
	    private String response;
	    private int signatures;
	    private Long petitionerId;
	    private String petitionerName; 
	    private int signatureThreshold;

}
