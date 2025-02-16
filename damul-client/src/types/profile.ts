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
  followed: boolean;
  followerCount: number;
  followingCount: number;
  selfIntroduction: string;
  foodPreference: FoodPreference[];
}

export interface BadgeBasic {
  badgeId: number;
  badgeName: string;
  badgeLevel: number;
}

export interface BadgeDetail {
  id: number;
  title: string;
  level: number;
  createdAt: string;
  description: string;
  rank: number;
  catchPhrase: string;
}
