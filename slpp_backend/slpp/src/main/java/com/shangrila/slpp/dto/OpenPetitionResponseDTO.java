package com.shangrila.slpp.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OpenPetitionResponseDTO {

	private Long petition_id;
    private String status;
    private String petition_title;
    private String petition_text;
    private String petitioner;
    private int signatures;
    private String response;
}
