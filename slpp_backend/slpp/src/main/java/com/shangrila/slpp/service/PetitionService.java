package com.shangrila.slpp.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.shangrila.slpp.dto.OpenPetitionResponseDTO;
import com.shangrila.slpp.dto.PetitionDTO;
import com.shangrila.slpp.dto.ProfileResponseDTO;
import com.shangrila.slpp.dto.ResponsePetitionDTO;
import com.shangrila.slpp.dto.ThresholdDTO;
import com.shangrila.slpp.entity.Petition;
import com.shangrila.slpp.entity.Petitioner;
import com.shangrila.slpp.enums.PetitionStatus;
import com.shangrila.slpp.repository.PetitionRepository;

import jakarta.transaction.Transactional;

@Service
public class PetitionService {

	@Autowired
	private PetitionRepository petitionRepository;

	@Transactional
	public Petition createPetition(PetitionDTO petitionDTO, Petitioner petitioner) {

		if (petitionDTO.getPetitionTitle() == null || petitionDTO.getPetitionTitle().isEmpty()) {
			throw new IllegalArgumentException("Petition title cannot be null or empty");
		}

		if (petitionDTO.getPetitionContent() == null || petitionDTO.getPetitionContent().isEmpty()) {
			throw new IllegalArgumentException("Petition content cannot be null or empty");
		}

		Petition petition = new Petition();
		petition.setTitle(petitionDTO.getPetitionTitle());
		petition.setContent(petitionDTO.getPetitionContent());
		petition.setStatus(PetitionStatus.OPEN);
		petition.setPetitioner(petitioner);
		petition.setSignatureCount(0);
		petition.setSignatures(new ArrayList<>());
		petition.setSignatureThreshold(30);

		return petitionRepository.save(petition);
	}

	@Transactional
	public List<ResponsePetitionDTO> getAllPetitions() {
		List<Petition> petitions = petitionRepository.findAllOrderByStatus();

		return petitions.stream().map(petition -> {
			ResponsePetitionDTO responseDTO = new ResponsePetitionDTO();
			responseDTO.setId(petition.getId());
			responseDTO.setTitle(petition.getTitle());
			responseDTO.setContent(petition.getContent());
			responseDTO.setStatus(petition.getStatus().toString());
			responseDTO.setResponse(petition.getResponse());
			responseDTO.setSignatures(petition.getSignatureCount());
			responseDTO.setSignatureThreshold(petition.getSignatureThreshold());
			responseDTO.setPetitionerId(petition.getPetitioner().getId());
			responseDTO.setPetitionerName(petition.getPetitioner().getFullName());
			return responseDTO;
		}).collect(Collectors.toList());
	}

	public ThresholdDTO updateSignatureThresholdAndClosePetitions(int threshold) {
		if (threshold <= 0) {
			throw new IllegalArgumentException("Threshold must be a positive number.");
		}

		List<Petition> petitions = petitionRepository.findAll();

		for (Petition petition : petitions) {
			if (petition.getStatus() == PetitionStatus.OPEN) {
				petition.setSignatureThreshold(threshold);
			}
		}

		petitionRepository.saveAll(petitions);

		ThresholdDTO response = new ThresholdDTO();
		response.setUpdatedThreshold(threshold);
		response.setStatus(HttpStatus.OK.value());
		response.setMessage("Signature threshold updated successfully");

		return response;
	}

	public String addResponseAndClosePetition(Long petitionId, String response) {
		if (response == null || response.isBlank()) {
			throw new IllegalArgumentException("Response cannot be null or empty.");
		}

		Petition petition = petitionRepository.findById(petitionId)
				.orElseThrow(() -> new IllegalArgumentException("Petition with ID " + petitionId + " not found."));

		if (petition.getStatus() == PetitionStatus.CLOSED) {
			return "Petition is already closed. Response cannot be updated.";
		}

		petition.setResponse(response);

		if (petition.getSignatureCount() >= petition.getSignatureThreshold()) {
			petition.setStatus(PetitionStatus.CLOSED);
			petitionRepository.save(petition);
			return "Response added to petition ID " + petitionId + " and its status has been updated to CLOSED.";
		} else {
			petitionRepository.save(petition);
			return "Response added to petition ID " + petitionId
					+ ". Petition remains OPEN as it hasn't met the signature threshold.";
		}
	}

	@Transactional
	public List<OpenPetitionResponseDTO> getAllPetitionsOpenAPI() {
		List<Petition> petitions = petitionRepository.findAll();

		return petitions.stream().map(petition -> {
			OpenPetitionResponseDTO responseDTO = new OpenPetitionResponseDTO();
			responseDTO.setPetition_id(petition.getId());
			responseDTO.setPetition_title(petition.getTitle());
			responseDTO.setPetition_text(petition.getContent());
			responseDTO.setStatus(petition.getStatus().toString());
			responseDTO.setResponse(petition.getResponse());
			responseDTO.setSignatures(petition.getSignatureCount());
			responseDTO.setPetitioner(petition.getPetitioner().getEmail()); // assuming you want email
			return responseDTO;
		}).collect(Collectors.toList());
	}

	@Transactional
	public List<OpenPetitionResponseDTO> getOpenPetitions() {
		List<Petition> petitions = petitionRepository.findByStatus(PetitionStatus.OPEN);

		return petitions.stream().map(petition -> {
			OpenPetitionResponseDTO responseDTO = new OpenPetitionResponseDTO();
			responseDTO.setPetition_id(petition.getId());
			responseDTO.setPetition_title(petition.getTitle());
			responseDTO.setPetition_text(petition.getContent());
			responseDTO.setStatus(petition.getStatus().toString());
			responseDTO.setResponse(petition.getResponse());
			responseDTO.setSignatures(petition.getSignatureCount());
			responseDTO.setPetitioner(petition.getPetitioner().getEmail()); // assuming you want email
			return responseDTO;
		}).collect(Collectors.toList());
	}

	@Transactional
	public List<ProfileResponseDTO> getPetitionsByPetitionerId(Long petitionerId) {
		List<Petition> petitions = petitionRepository.findByPetitionerId(petitionerId);
		return petitions.stream()
				.map(petition -> new ProfileResponseDTO(petition.getTitle(), petition.getContent(),
						petition.getSignatureCount(), petition.getStatus().toString(), petition.getResponse()))
				.collect(Collectors.toList());
	}
}
