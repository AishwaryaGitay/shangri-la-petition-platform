package com.shangrila.slpp.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.shangrila.slpp.entity.Petitioner;

@Repository
public interface PetitionerRepository extends JpaRepository<Petitioner, Long> {
    
	boolean existsByEmail(String email);

	Petitioner findByEmail(String email);
	
	Petitioner findByBioId(String bioId);
	
	Optional findById(Long id);
}
