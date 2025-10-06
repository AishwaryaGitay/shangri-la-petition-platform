package com.shangrila.slpp.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shangrila.slpp.dto.ErrorResponseDTO;
import com.shangrila.slpp.dto.PetitionDTO;
import com.shangrila.slpp.dto.ProfileResponseDTO;
import com.shangrila.slpp.dto.ResponsePetitionDTO;
import com.shangrila.slpp.dto.SignPetitionDTO;
import com.shangrila.slpp.dto.SignPetitionResponseDTO;
import com.shangrila.slpp.entity.Petition;
import com.shangrila.slpp.entity.Petitioner;
import com.shangrila.slpp.repository.PetitionerRepository;
import com.shangrila.slpp.service.PetitionService;
import com.shangrila.slpp.service.SignatureService;

@RestController
@RequestMapping("/slpp/petition")
public class PetitionController {

	@Autowired
	private PetitionService petitionService;

	@Autowired
	private SignatureService signatureService;

	@Autowired
	private PetitionerRepository petitionerRepository;

	@PreAuthorize("hasRole('PETITIONER')")
	@PostMapping("/create")
	public ResponseEntity<?> createPetition(@RequestBody PetitionDTO petitionDTO) {
		try {
			@SuppressWarnings("unchecked")
			Optional<Petitioner> optionalPetitioner = petitionerRepository.findById(petitionDTO.getPetitionerId());
			if (!optionalPetitioner.isPresent()) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST)
						.body(new ErrorResponseDTO("Invalid petitioner ID"));
			}
			Petitioner petitioner = optionalPetitioner.get();

			Petition petition = petitionService.createPetition(petitionDTO, petitioner);
			return ResponseEntity.status(HttpStatus.CREATED).body(petition);
		} catch (IllegalArgumentException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body(new ErrorResponseDTO("Invalid petition data: " + e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(new ErrorResponseDTO("An unexpected error occurred: " + e.getMessage()));
		}
	}

	@PreAuthorize("hasRole('PETITIONER') or hasRole('ADMIN')")
	@GetMapping("/all")
	public ResponseEntity<?> getAllPetitions() {
		try {
			List<ResponsePetitionDTO> petitions = petitionService.getAllPetitions();
			return ResponseEntity.ok(petitions);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(new ErrorResponseDTO("An unexpected error occurred: " + e.getMessage()));
		}
	}

	@PreAuthorize("hasRole('PETITIONER')")
	@PostMapping("/sign")
	public ResponseEntity<?> signPetition(@RequestBody SignPetitionDTO requestDTO) {
		try {
			@SuppressWarnings("unchecked")
			Optional<Petitioner> petitionerOpt = petitionerRepository.findById(requestDTO.getPetitionerId());
			if (petitionerOpt.isEmpty()) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponseDTO("Petitioner not found"));
			}

			Petitioner petitioner = petitionerOpt.get();
			SignPetitionResponseDTO responseDTO = signatureService.signPetition(requestDTO.getPetitionId(), petitioner);
			return ResponseEntity.ok(responseDTO);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(new ErrorResponseDTO("An unexpected error occurred: " + e.getMessage()));
		}
	}

	@PreAuthorize("hasRole('PETITIONER')")
	@GetMapping("/petitions/{petitionerId}")
	public ResponseEntity<?> getPetitionsByPetitionerId(@PathVariable Long petitionerId) {
		try {
			List<ProfileResponseDTO> petitions = petitionService.getPetitionsByPetitionerId(petitionerId);
			return ResponseEntity.ok(petitions);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(new ErrorResponseDTO("An unexpected error occurred: " + e.getMessage()));
		}
	}

}