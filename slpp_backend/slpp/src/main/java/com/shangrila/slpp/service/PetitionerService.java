package com.shangrila.slpp.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.shangrila.slpp.dto.PetitionerDTO;
import com.shangrila.slpp.entity.BioId;
import com.shangrila.slpp.entity.Petitioner;
import com.shangrila.slpp.enums.Role;
import com.shangrila.slpp.repository.BioIdRepository;
import com.shangrila.slpp.repository.PetitionerRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PetitionerService {

	private final BioIdRepository bioIdRepository;
	private final PetitionerRepository petitionerRepository;
	private final PasswordEncoder passwordEncoder;

	@Transactional
	public String registerPetitioner(PetitionerDTO petitionerDTO) {
		BioId bioId = bioIdRepository.findByCode(petitionerDTO.getBiometricId())
				.orElseThrow(() -> new IllegalArgumentException("Invalid BioID."));

		if (bioId.getUsed() == 1) {
			throw new IllegalArgumentException("BioID has already been used.");
		}

		// Check if email is already registered
		if (petitionerRepository.existsByEmail(petitionerDTO.getEmailId())) {
			throw new IllegalArgumentException("Email is already registered.");
		}

		Petitioner petitioner = Petitioner.builder().email(petitionerDTO.getEmailId())
				.fullName(petitionerDTO.getPetitionerFullName()).dateOfBirth(petitionerDTO.getBirthDate())
				.password(passwordEncoder.encode(petitionerDTO.getPassword())).bioId(petitionerDTO.getBiometricId())
				.role(Role.PETITIONER).build();
		petitionerRepository.save(petitioner);

		bioId.setUsed(1);
		bioIdRepository.save(bioId);

		return "Registration successful.";
	}
}
