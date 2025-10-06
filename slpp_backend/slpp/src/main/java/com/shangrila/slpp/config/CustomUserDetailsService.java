package com.shangrila.slpp.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.shangrila.slpp.entity.Petitioner;
import com.shangrila.slpp.repository.PetitionerRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

	@Autowired
	private PetitionerRepository petitionerRepository;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Petitioner petitioner = petitionerRepository.findByEmail(username);
		if (petitioner == null) {
			throw new UsernameNotFoundException("User not found with email: " + username);
		}

		return User.builder().username(petitioner.getEmail()).password(petitioner.getPassword())
				.authorities(petitioner.getRole().getAuthorities()).build();
	}
}
