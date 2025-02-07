export interface Ingredient {
  userIngredientId: number;
  categoryId: number;
  ingredientName: string;
  ingredientQuantity: number;
  expirationDate: number;
}

export interface IngredientData {
  freezer: Ingredient[];
  fridge: Ingredient[];
  roomTemp: Ingredient[];
  expiringSoon?: Ingredient[];
}
