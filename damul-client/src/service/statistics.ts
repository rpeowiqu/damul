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

export const getPurchaseHistories = (year: number, month: number) => {
  console.log("요청");
  const queryString = toQueryString({ year, month });
  return apiClient.get(`/receipts/calendar?${queryString}`);
};

export const getSmartReceipt = (receiptId: number) => {
  return apiClient.get(`/receipts/${receiptId}`);
};
