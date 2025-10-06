package com.shangrila.slpp.entity;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.shangrila.slpp.enums.Role;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(name = "petitioners")
public class Petitioner implements UserDetails{
	
	   private static final long serialVersionUID = 1L;

	    @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;
	    
	    @Column(name = "email", nullable = false, unique = true)
	    @Email(regexp = "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}",
        flags = Pattern.Flag.CASE_INSENSITIVE)
	    private String email;

	    @Column(name = "fullname", nullable = false)
	    private String fullName;

	    @Column(name = "dob")
	    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	    private LocalDate dateOfBirth;

	    @Column(name = "password", nullable = false)
	    private String password;

	    @Column(name = "bioid", unique = true)
	    private String bioId;

	    @Column(name = "role", nullable = false)
	    @Enumerated(EnumType.STRING)
	    private Role role;
	    
	    @OneToMany(mappedBy = "petitioner", cascade = CascadeType.ALL, orphanRemoval = true)
	    private List<Petition> petitions;

	    @OneToMany(mappedBy = "petitioner", cascade = CascadeType.ALL, orphanRemoval = true)
	    private List<Signature> signatures;

		@Override
		public Collection<? extends GrantedAuthority> getAuthorities() {
			return role.getAuthorities();
		}

		@Override
		public String getUsername() {
			return email;
		}
	    
	    


}
