package com.shangrila.slpp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.shangrila.slpp.entity.Petition;
import com.shangrila.slpp.entity.Petitioner;
import com.shangrila.slpp.entity.Signature;

@Repository
public interface SignatureRepository extends JpaRepository<Signature, Long> {

    boolean existsByPetitionAndPetitioner(Petition petition, Petitioner petitioner);
}