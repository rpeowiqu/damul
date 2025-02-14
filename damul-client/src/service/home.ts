import { RegisterIngredientData } from "@/types/Ingredient";
import apiClient from "./http";

export const getUserIndegredient = async () => {
  return apiClient.get("/home");
};

export const getRecommandedRecipe = async () => {
  return apiClient.get("/home/recommandation");
};

export const patchUserIndegredient = async (
  ingredientId: number,
  data: { ingredientQuantity: number },
) => {
  return apiClient.patch(`/home/ingredients/${ingredientId}`, data);
};

export const deleteUserIndegredient = async (
  ingredientId: number,
  warningEnable: number,
) => {
  return apiClient.delete(
    `/home/ingredients/${ingredientId}?warningEnable=${warningEnable}`,
  );
};

export const postUserIndegredient = async (data: RegisterIngredientData) => {
  return apiClient.post(`/home/ingredients/register`, data);
};

export const postReceiptForOCR = async (formData: FormData) => {
  return apiClient.post("/ocr", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    baseURL: import.meta.env.VITE_API_OCR_URL,
    withCredentials: true,
  });
};
