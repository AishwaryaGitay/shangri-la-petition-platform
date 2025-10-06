package com.shangrila.slpp.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
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
@Table(name = "bioids")
public class BioId {

    @Id
    @Column(name = "code", length = 20, nullable = false, unique = true)
    private String code;

    @Column(name = "used", nullable = false, columnDefinition = "int default 0")
    private int used;
}