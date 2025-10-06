package com.shangrila.slpp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shangrila.slpp.dto.ErrorResponseDTO;
import com.shangrila.slpp.dto.LoginRequestDTO;
import com.shangrila.slpp.dto.LoginResponse;
import com.shangrila.slpp.dto.QRLoginRequestDTO;
import com.shangrila.slpp.entity.Petitioner;
import com.shangrila.slpp.enums.Role;
import com.shangrila.slpp.repository.PetitionerRepository;
import com.shangrila.slpp.service.JWTService;

@RestController
@RequestMapping("/slpp")
public class LoginController {

	@Autowired
	AuthenticationManager authManager;

	@Autowired
	private JWTService jwtService;

	@Autowired
	private PetitionerRepository petitionerRepository;

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginRequestDTO request) {
		try {
			Authentication authentication = authManager
					.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
			UserDetails userDetails = (UserDetails) authentication.getPrincipal();

			String token = jwtService.generateToken(userDetails);
			Petitioner petitioner = petitionerRepository.findByEmail(request.getEmail());

			if (petitioner == null) {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponseDTO("User not found"));
			}

			LoginResponse response = new LoginResponse(token, request.getRole(), petitioner.getId(),
					petitioner.getFullName());
			return ResponseEntity.ok(response);
		} catch (UsernameNotFoundException | BadCredentialsException e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponseDTO("Invalid credentials"));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(new ErrorResponseDTO("An unexpected error occurred"));
		}
	}

	@PostMapping("/qr-login")
	public ResponseEntity<?> qrLogin(@RequestBody QRLoginRequestDTO request) {
		Petitioner petitioner = petitionerRepository.findByBioId(request.getBioId());
		if (petitioner == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponseDTO("Invalid BioID"));
		}
		String token = jwtService.generateToken(petitioner);
		LoginResponse response = new LoginResponse(token, Role.PETITIONER, petitioner.getId(),
				petitioner.getFullName());
		return ResponseEntity.ok(response);
	}

}
