package com.ppp.backend.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "PROJECT_SKILL")
@Getter
@ToString
@EqualsAndHashCode
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor
public class ProjectSkill {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "project_id", nullable = false)
	@ToString.Exclude
	private Project project;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "skill_id", nullable = false)
	private Skill skill;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "skill_level_id", nullable = false)
	private SkillLevel skillLevel;
}
