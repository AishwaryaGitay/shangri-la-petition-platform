package com.shangrila.slpp.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class QRLoginRequestDTO {

	@NotBlank(message = "BioID is required")
    private String bioId;
	
}
