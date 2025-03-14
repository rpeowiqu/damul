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

    @Column(name = "title", length = 100, nullable = false)
    private String title;

    @Column(name = "standard", nullable = false)
    private short standard;

    @Column(name = "description", length = 255, nullable = false)
    private String description;

    @Column(name = "catch_phrase", length = 255)
    private String catchPhrase;

    @Column(name = "level")
    private int level;

}
