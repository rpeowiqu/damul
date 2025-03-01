package com.damul.api.recipe.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "tags")
@Getter
@NoArgsConstructor
public class Tag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "tag_name", length = 30, nullable = false, unique = true)
    private String tagName;

    @OneToMany(mappedBy = "tag")
    private List<RecipeTag> recipeTags;
}
