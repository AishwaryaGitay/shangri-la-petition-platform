package com.shangrila.slpp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.shangrila.slpp.dto.AdminRequestDTO;
import com.shangrila.slpp.dto.ErrorResponseDTO;
import com.shangrila.slpp.dto.ThresholdDTO;
import com.shangrila.slpp.service.PetitionService;

@RestController
@RequestMapping("/slpp/admin")
public class AdminController {

	@Autowired
	private PetitionService petitionService;

	@PreAuthorize("hasRole('ADMIN')")
	@PostMapping("/petitions/update-threshold")
	public ResponseEntity<ThresholdDTO> updateSignatureThreshold(@RequestParam int threshold) {
		ThresholdDTO result = new ThresholdDTO();
		try {
			result = petitionService.updateSignatureThresholdAndClosePetitions(threshold);
			return ResponseEntity.ok(result);
		} catch (IllegalArgumentException e) {
			result.setStatus(HttpStatus.BAD_REQUEST.value());
			result.setMessage(e.getMessage());
			result.setUpdatedThreshold(threshold);
			return ResponseEntity.badRequest().body(result);
		} catch (Exception e) {
			result.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
			result.setMessage("An unexpected error occurred: " + e.getMessage());
			result.setUpdatedThreshold(threshold);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
		}
	}

	@PreAuthorize("hasRole('ADMIN')")
	@PostMapping("/petition/respond")
	public ResponseEntity<?> respondToPetition(@RequestBody AdminRequestDTO requestDTO) {
		try {
			String responseMessage = petitionService.addResponseAndClosePetition(requestDTO.getPetitionId(),
					requestDTO.getResponse());
			return ResponseEntity.ok(responseMessage);
		} catch (IllegalArgumentException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponseDTO(e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(new ErrorResponseDTO("An unexpected error occurred: " + e.getMessage()));
		}
	}
}
