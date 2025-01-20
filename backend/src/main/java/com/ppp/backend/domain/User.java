package com.ppp.backend.domain;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
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
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table
@Getter
@ToString
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor
public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String password;
	
	@Column(nullable = false)
	private String name;
	
	@Column(nullable = false)
	private String email;

	private String phoneNumber;

	private String experience;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "provider_id")
	@ToString.Exclude
	private Provider provider;

	@ToString.Exclude
	@CreationTimestamp
	private LocalDateTime createdAt;

	@ToString.Exclude
	@UpdateTimestamp
	private LocalDateTime updatedAt;
}
