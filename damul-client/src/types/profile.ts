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

export interface Badge {
  id: number;
  title: string;
  level: number;
}

export interface BadgeList {
  list: Badge[];
}

export interface BadgeDetail {
  id: number;
  title: string;
  level: number;
  description: string;
  createdAt: string;
  rank: number;
  achieveCond: string;
}
