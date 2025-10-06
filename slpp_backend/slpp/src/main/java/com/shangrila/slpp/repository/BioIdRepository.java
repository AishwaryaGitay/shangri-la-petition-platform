package com.shangrila.slpp.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.shangrila.slpp.entity.BioId;

@Repository
public interface BioIdRepository extends JpaRepository<BioId, String> {
    
	Optional<BioId> findByCode(String code);
}

