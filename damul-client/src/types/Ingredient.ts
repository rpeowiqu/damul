export interface Ingredient {
  userIngredientId: number;
  categoryId: number;
  ingredientName: string;
  ingredientQuantity: number;
  expirationDate: number;
  storage: string;
  purchaseDate: string;
}

export interface IngredientData {
  freezer: Ingredient[];
  fridge: Ingredient[];
  roomTemp: Ingredient[];
}

export interface RegisterIngredientData {
  purchaseAt: string;
  storeName: string;
  userIngredients: {
    ingredientName: string;
    categoryId: number;
    productPrice: number;
    expirationDate: string;
    ingredientStorage: "FREEZER" | "FRIDGE" | "ROOM_TEMP";
  }[];
}
