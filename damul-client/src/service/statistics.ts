import toQueryString from "@/utils/toQueryString";
import apiClient from "./http";

export const getIngredientTrends = (queryParams: {
  period: string;
  productNo: string;
}) => {
  const queryString = toQueryString(queryParams);
  return apiClient.get(`/ingredients/prices?${queryString}`);
};

export const getIngredientItems = () => {
  return apiClient.get("/ingredients/categories/items");
};

export const getIngredientCategories = () => {
  return apiClient.get("/ingredients/categories/");
};

export const getPurchaseHistories = () => {
  return apiClient.get("/purchases/calendar");
};

export const getSmartReceipt = (receiptId: number) => {
  return apiClient.get(`/purchases/${receiptId}`);
};
