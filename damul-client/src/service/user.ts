import toQueryString from "@/utils/toQueryString";
import apiClient from "./http";

export const getUserSetting = (userId: number) => {
  return apiClient.get(`/users/${userId}/settings`);
};

export const modifyUserSetting = (
  userId: number,
  settingUpdate: {
    nickname: string;
    selfIntroduction: string;
    accessRange: "PUBLIC" | "FRIENDS" | "PRIVATE";
    warningEnabled: boolean;
  },
  profileImage: File | null,
  backgroundImage: File | null,
) => {
  const formData = new FormData();
  const settingBlob = new Blob([JSON.stringify(settingUpdate)], {
    type: "application/json",
  });
  formData.append("settingUpdate", settingBlob);
  if (profileImage) {
    formData.append("profileImage", profileImage);
  }
  if (backgroundImage) {
    formData.append("backgroundImage", backgroundImage);
  }

  return apiClient.put(`/users/${userId}/settings`, formData);
};

export const checkNicknameDuplication = (nickname: string) => {
  return apiClient.post("/users/check-nickname", { nickname });
};

export const getFollowers = (
  userId: number,
  queryParams: { cursor: number; size: number },
) => {
  const queryString = toQueryString(queryParams);
  return apiClient.get(`/users/${userId}/followers?${queryString}`);
};

export const getFollowings = (
  userId: number,
  queryParams: { cursor: number; size: number },
) => {
  const queryString = toQueryString(queryParams);
  return apiClient.get(`/users/${userId}/followings?${queryString}`);
};

export const toggleFollow = (followRequest: {
  userId: number;
  targetId: number;
}) => {
  return apiClient.post("/users/follows", followRequest);
};

export const deleteFollower = (userId: number, followerId: number) => {
  return apiClient.delete(`/users/${userId}/followers/${followerId}`);
};

export const getUser = (queryParams: {
  keyword: string;
  cursor: number;
  size: number;
}) => {
  const queryString = toQueryString(queryParams);
  return apiClient.get(`/users?${queryString}`);
};
