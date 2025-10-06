package com.shangrila.slpp.enums;

import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

public enum Role implements GrantedAuthority {

	PETITIONER("PETITIONER"),
	ADMIN("ADMIN");

	
private final String[] authorities;
    
    Role(String... authorities) {
        this.authorities = authorities;
    }
    
    @Override
    public String getAuthority() {
        return name();
    }
    
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.unmodifiableList(Arrays.stream(authorities)
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList()));
    }
}
