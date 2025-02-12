package com.damul.api.mypage.entity;

import com.damul.api.auth.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "food_preference")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class FoodPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", referencedColumnName = "id")
    private FoodCategory category;

    @Column(name = "category_preference", nullable = false)
    private int categoryPreference;

    public void increaseCategoryPreference(int count) {
        categoryPreference += count;
    }

    @Builder
    public FoodPreference(User user, FoodCategory category, int categoryPreference) {
        this.user = user;
        this.category = category;
        this.categoryPreference = categoryPreference;
    }

}
