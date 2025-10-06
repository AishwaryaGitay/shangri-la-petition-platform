package com.shangrila.slpp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.shangrila.slpp.dto.ErrorResponseDTO;
import com.shangrila.slpp.dto.OpenPetitionResponseDTO;
import com.shangrila.slpp.dto.OpenPetitionsResponseDTO;
import com.shangrila.slpp.service.PetitionService;

@RestController
@RequestMapping("/slpp")
public class OpenPetitionsController {

	@Autowired
	private PetitionService petitionService;

	@GetMapping("/petitions")
	public ResponseEntity<?> getAllPetitions(@RequestParam(value = "status", required = false) String status) {
		try {
			List<OpenPetitionResponseDTO> petitions;
			if (status != null && status.equalsIgnoreCase("open")) {
				petitions = petitionService.getOpenPetitions();
			} else {
				petitions = petitionService.getAllPetitionsOpenAPI();
			}
			OpenPetitionsResponseDTO response = new OpenPetitionsResponseDTO();
			response.setPetitions(petitions);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(new ErrorResponseDTO("An unexpected error occurred: " + e.getMessage()));
		}
	}
}
