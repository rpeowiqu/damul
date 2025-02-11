export interface ProfileHeader {
  userId: number;
  nickname: string;
  profileImageUrl: string;
  profileBackgroundImageUrl: string;
}

export interface UserSearchResult {
  userId: number;
  nickname: string;
  profileImageUrl: string;
}

export interface FoodPreference {
  categoryId: number;
  categoryName: string;
  categoryPreference: number;
}

export interface ProfileInfo {
  followerCount: number;
  followingCount: number;
  selfIntroduction: string;
  foodPreference: FoodPreference[];
}

export interface Badge {
  badgeId: number;
  badgeName: string;
  badgeLevel: number;
  condition: string;
  description: string;
}

export interface BadgeList {
  list: Badge[];
}
