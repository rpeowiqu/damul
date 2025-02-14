import { create } from "zustand";
import { Ingredient } from "@/types/Ingredient";

interface IngredientStore {
  selectedIngredients: Ingredient[];
  setSelectedIngredients: (ingredient: Ingredient) => void;
  clearSelectedIngredients: () => void;
}

export const useIngredientStore = create<IngredientStore>((set) => ({
  selectedIngredients: [],
  setSelectedIngredients: (ingredient) =>
    set((state) => {
      const isAlreadySelected = state.selectedIngredients.some(
        (item) => item.userIngredientId === ingredient.userIngredientId,
      );
      return {
        selectedIngredients: isAlreadySelected
          ? state.selectedIngredients.filter(
              (item) => item.userIngredientId !== ingredient.userIngredientId,
            )
          : [...state.selectedIngredients, ingredient],
      };
    }),
  clearSelectedIngredients: () => set({ selectedIngredients: [] }),
}));
