import toQueryString from "@/utils/toQueryString";
import apiClient from "./http";

export const getProfileHeader = (userId: number) => {
  return apiClient.get(`/mypages/${userId}/header`);
};

export const getProfileDetail = (userId: number) => {
  return apiClient.get(`/mypages/${userId}/profiles`);
};

export const getBadges = (userId: number) => {
  return apiClient.get(`/mypages/${userId}/badges`);
};

export const getBadge = (userId: number, badgeId: number) => {
  return apiClient.get(`/mypages/${userId}/badges/${badgeId}`);
};

export const getMyRecipes = (
  userId: number,
  queryParams: {
    cursor: number;
    size: number;
    sortType: "created_at" | "view_cnt" | "like_cnt";
  },
) => {
  const queryString = toQueryString(queryParams);
  return apiClient.get(`/mypages/${userId}/recipes?${queryString}`);
};

export const getBookmarks = (
  userId: number,
  queryParams: {
    cursor: number;
    size: number;
    sortType: "created_at" | "view_cnt" | "like_cnt";
  },
) => {
  const queryString = toQueryString(queryParams);
  return apiClient.get(`/mypages/${userId}/bookmarks?${queryString}`);
};

export const getIngredients = (userId: number) => {
  return apiClient.get(`/mypages/${userId}/ingredients`);
};
