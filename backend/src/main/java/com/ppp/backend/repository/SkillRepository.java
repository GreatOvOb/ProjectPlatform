package com.ppp.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ppp.backend.domain.Skill;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long>{
	Skill findByNameIgnoreCase(String name);
}
