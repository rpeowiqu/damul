import toQueryString from "@/utils/toQueryString";
import { apiClient, apiRequest } from "./http";

export const getProfileHeader = (userId: number) => {
  return apiRequest(() => apiClient.get(`/mypages/${userId}/header`));
};

export const getProfileDetail = (userId: number) => {
  return apiRequest(() => apiClient.get(`/mypages/${userId}/profiles`));
};

export const getProfileBadges = (userId: number) => {
  return apiRequest(() => apiClient.get(`/mypages/${userId}/badges`));
};

export const getProfileBadge = (userId: number, badgeId: number) => {
  return apiRequest(() =>
    apiClient.get(`/mypages/${userId}/badges/${badgeId}`),
  );
};

export const getMyRecipes = (
  userId: number,
  queryParams: { cursor: number; size: number },
) => {
  const queryString = toQueryString(queryParams);
  return apiRequest(() =>
    apiClient.get(`/mypages/${userId}/recipes?${queryString}`),
  );
};

export const getBookmarks = (
  userId: number,
  queryParams: { cursor: number; size: number },
) => {
  const queryString = toQueryString(queryParams);
  return apiRequest(() =>
    apiClient.get(`/mypages/${userId}/bookmarks?${queryString}`),
  );
};

export const getIngredients = (userId: number) => {
  return apiRequest(() => apiClient.get(`/mypages/${userId}/ingredients`));
};
