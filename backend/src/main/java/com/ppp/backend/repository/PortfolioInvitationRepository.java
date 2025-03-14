package com.ppp.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ppp.backend.domain.PortfolioInvitation;

@Repository
public interface PortfolioInvitationRepository extends JpaRepository<PortfolioInvitation, Long>{
	
}
