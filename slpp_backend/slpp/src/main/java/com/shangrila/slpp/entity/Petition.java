package com.shangrila.slpp.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.shangrila.slpp.enums.PetitionStatus;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "petitions")
public class Petition {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@JsonIgnore
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "petitioner_id", nullable = false)
	private Petitioner petitioner;

	@Column(name = "title", nullable = false)
	private String title;

	@Lob
	@Column(name = "content", nullable = false, columnDefinition = "LONGTEXT")
	private String content;

	@Column(name = "status", nullable = false)
	@Enumerated(EnumType.STRING)
	private PetitionStatus status;

	@Lob
	@Column(name = "response", columnDefinition = "LONGTEXT")
	private String response;

	@Column(name = "signature_count", nullable = false, columnDefinition = "int default 0")
	private int signatureCount;

	@Column(name = "signature_threshold", nullable = false)
	private int signatureThreshold;

	@OneToMany(mappedBy = "petition", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Signature> signatures;

}
