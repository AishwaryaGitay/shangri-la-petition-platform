package com.shangrila.slpp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shangrila.slpp.dto.PetitionerDTO;
import com.shangrila.slpp.service.PetitionerService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/slpp/petitioner")
public class PetitionerController {

	@Autowired
	private PetitionerService petitionerService;

	@Autowired
	AuthenticationManager authManager;

	@PostMapping("/register")
	public ResponseEntity<?> registerPetitioner(@Valid @RequestBody PetitionerDTO petitionerDTO) {
		try {
			String response = petitionerService.registerPetitioner(petitionerDTO);
			return ResponseEntity.ok(response);
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		} catch (Exception e) {
			return ResponseEntity.status(500).body("An unexpected error occurred. Please try again.");
		}
	}

}
