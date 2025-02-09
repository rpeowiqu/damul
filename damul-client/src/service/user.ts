import toQueryString from "@/utils/toQueryString";
import { apiClient, apiRequest } from "./http";

export const getUserSetting = (userId: number) => {
  return apiRequest(() => apiClient.get(`/users/${userId}/settings`));
};

export const setUserSetting = (
  userId: number,
  settingUpdate: {
    userId: number;
    nickname: string;
    selfIntroduction: string;
    accessRange: "public" | "friends" | "private";
    warningEnabled: boolean;
  },
  profileImage?: File,
  backgroundImage?: File,
) => {
  const formData = new FormData();
  Object.entries(settingUpdate).forEach(([key, value]) => {
    formData.append(key, value.toString());
  });
  if (profileImage) {
    formData.append("profileImage", profileImage);
  }
  if (backgroundImage) {
    formData.append("backgroundImage", backgroundImage);
  }

  return apiRequest(() => apiClient.put(`/users/${userId}/settings`, formData));
};

export const checkNicknameDuplication = (nickname: string) => {
  return apiRequest(() => apiClient.post("/users/nickname-check", nickname));
};

export const getFollowers = (
  userId: number,
  queryParams: { cursor: number; size: number },
) => {
  const queryString = toQueryString(queryParams);
  return apiRequest(() =>
    apiClient.get(`/users/${userId}/followers?${queryString}`),
  );
};

export const getFollowings = (
  userId: number,
  queryParams: { cursor: number; size: number },
) => {
  const queryString = toQueryString(queryParams);
  return apiRequest(() =>
    apiClient.get(`/users/${userId}/followings?${queryString}`),
  );
};

export const toggleFollow = (followRequest: {
  userId: number;
  targetId: number;
}) => {
  return apiRequest(() => apiClient.post("/users/follows", followRequest));
};

export const deleteFollower = (userId: number, followerId: number) => {
  return apiRequest(() =>
    apiClient.delete(`/users/${userId}/force-unfollow/${followerId}`),
  );
};

export const searchUser = (nickname: string) => {
  return apiRequest(() => apiClient.get(`/users/search/${nickname}`));
};
