package com.shangrila.slpp.dto;

import java.util.List;

public class OpenPetitionsResponseDTO {

	
	private List<OpenPetitionResponseDTO> petitions;

    public List<OpenPetitionResponseDTO> getPetitions() {
        return petitions;
    }

    public void setPetitions(List<OpenPetitionResponseDTO> petitions) {
        this.petitions = petitions;
    }
}
