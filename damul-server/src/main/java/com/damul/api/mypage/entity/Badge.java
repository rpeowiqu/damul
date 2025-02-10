package com.damul.api.mypage.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "badge")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Badge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "name", length = 100, nullable = false)
    private String name;

    @Column(name = "standard", nullable = false)
    private short standard;

    @Column(name = "description", length = 255, nullable = false)
    private String description;

}
