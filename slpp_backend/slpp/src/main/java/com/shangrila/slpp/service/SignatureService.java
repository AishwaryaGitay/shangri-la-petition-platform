package com.shangrila.slpp.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shangrila.slpp.dto.SignPetitionResponseDTO;
import com.shangrila.slpp.entity.Petition;
import com.shangrila.slpp.entity.Petitioner;
import com.shangrila.slpp.entity.Signature;
import com.shangrila.slpp.enums.PetitionStatus;
import com.shangrila.slpp.repository.PetitionRepository;
import com.shangrila.slpp.repository.SignatureRepository;

import exceptions.AlreadySignedException;
import exceptions.PetitionClosedException;
import exceptions.PetitionNotFoundException;
import exceptions.SelfSignException;
import exceptions.SignatureThresholdReachedException;
import jakarta.transaction.Transactional;

@Service
public class SignatureService {

	@Autowired
	private PetitionRepository petitionRepository;

	@Autowired
	private SignatureRepository signatureRepository;

	@Transactional
	public SignPetitionResponseDTO signPetition(Long petitionId, Petitioner petitioner) {
		Petition petition = petitionRepository.findById(petitionId)
				.orElseThrow(() -> new PetitionNotFoundException("Petition not found"));

		if (!petition.getStatus().equals(PetitionStatus.OPEN)) {
			throw new PetitionClosedException("Petition is closed or not open for signatures");
		}

		if (petition.getSignatureCount() >= petition.getSignatureThreshold()) {
			throw new SignatureThresholdReachedException("No longer accepting new signatures for this petition");
		}

		if (petition.getPetitioner().getId().equals(petitioner.getId())) {
			throw new SelfSignException("You cannot sign your own petition.");
		}

		boolean alreadySigned = signatureRepository.existsByPetitionAndPetitioner(petition, petitioner);
		if (alreadySigned) {
			throw new AlreadySignedException("You have already signed this petition");
		}

		Signature signature = new Signature();
		signature.setPetition(petition);
		signature.setPetitioner(petitioner);
		signature.setSignedAt(LocalDateTime.now());
		signatureRepository.save(signature);

		petition.setSignatureCount(petition.getSignatureCount() + 1);
		petitionRepository.save(petition);

		return new SignPetitionResponseDTO(petition.getId(), petitioner.getId(), "Petition signed successfully",
				petition.getStatus().name(), petition.getSignatureCount(), petition.getSignatureThreshold());
	}
}