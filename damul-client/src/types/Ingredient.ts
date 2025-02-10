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
  expiringSoon?: Ingredient[];
}
