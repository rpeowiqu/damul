import toQueryString from "@/utils/toQueryString";
import apiClient from "./http";

export const getUserSetting = () => {
  return apiClient.get(`/users/settings`);
};

export const modifyUserSetting = (
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

  return apiClient.put(`/users/settings`, formData);
};

export const checkNicknameDuplication = (nickname: string) => {
  return apiClient.post("/users/check-nickname", { nickname });
};

export const getFollowers = (queryParams: {
  keyword: string;
  cursor: number;
  size: number;
}) => {
  const queryString = toQueryString(queryParams);
  return apiClient.get(`/users/followers?${queryString}`);
};

export const getFollowings = (queryParams: {
  keyword?: string;
  cursor: number;
  size: number;
}) => {
  const queryString = toQueryString(queryParams);
  return apiClient.get(`/users/followings?${queryString}`);
};

export const toggleFollow = (followRequest: { targetId: number }) => {
  return apiClient.post("/users/follows", followRequest);
};

export const deleteFollower = (followerId: number) => {
  return apiClient.delete(`/users/followers/${followerId}`);
};

export const getUsers = (queryParams: {
  keyword: string;
  cursor: number;
  size: number;
}) => {
  const queryString = toQueryString(queryParams);
  return apiClient.get(`/users?${queryString}`);
};
