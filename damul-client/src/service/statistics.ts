import toQueryString from "@/utils/toQueryString";
import apiClient from "./http";

export const getKamisIngredientTrends = (queryParams: {
  period: string;
  itemCode: number;
  kindCode: number;
  ecoFlag: boolean;
}) => {
  const queryString = toQueryString(queryParams);
  return apiClient.get(`/ingredients/prices?${queryString}`);
};

export const getKamisIngredients = () => {
  return apiClient.get("/ingredients/categories/items");
};

export const getIngredientCategories = () => {
  return apiClient.get("/ingredients/categories/");
};

export const getPurchaseHistories = (year: number, month: number) => {
  const queryString = toQueryString({ year, month });
  return apiClient.get(`/receipts/calendar?${queryString}`);
};

export const getSmartReceipt = (receiptId: number) => {
  return apiClient.get(`/receipts/${receiptId}`);
};
