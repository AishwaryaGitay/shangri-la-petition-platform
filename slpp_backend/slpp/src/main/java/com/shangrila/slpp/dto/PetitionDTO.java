package com.shangrila.slpp.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class PetitionDTO {

	@NotBlank(message = "Title is mandatory")
	private String petitionTitle;
	
	@NotBlank(message = "Content is mandatory")
    private String petitionContent;
	
	@NotBlank(message = "petitionerId is mandatory")
	private Long petitionerId;
}
