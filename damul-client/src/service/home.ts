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

export const deleteUserIndegredient = async (ingredientId: number) => {
  return apiClient.delete(`/home/ingredients/${ingredientId}`);
};

export const postUserIndegredient = async (data: RegisterIngredientData) => {
  return apiClient.post(`/home/register`, data);
};
