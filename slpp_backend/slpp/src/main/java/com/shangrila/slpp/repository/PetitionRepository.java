package com.shangrila.slpp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.shangrila.slpp.entity.Petition;
import com.shangrila.slpp.enums.PetitionStatus;

@Repository
public interface PetitionRepository extends JpaRepository<Petition, Long> {
    
	List<Petition> findByStatus(PetitionStatus status);
    
	List<Petition> findAll(); 
	
	@Query("SELECT p FROM Petition p ORDER BY CASE WHEN p.status = 'OPEN' THEN 0 ELSE 1 END, p.id")
    List<Petition> findAllOrderByStatus();
	
	List<Petition> findByPetitionerId(Long petitionerId);
}
