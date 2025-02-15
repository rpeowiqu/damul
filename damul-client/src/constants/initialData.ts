import { IngredientData, RegisterIngredientData } from "@/types/Ingredient";

export const initialIngrdientData: IngredientData = {
  freezer: [
    {
      userIngredientId: 4234,
      categoryId: 1,
      ingredientName: "쌀",
      ingredientQuantity: 50,
      expirationDate: 10,
      storage: "Freezer",
      purchaseDate: "2024-01-15",
    },
  ],
  fridge: [
    {
      userIngredientId: 532446,
      categoryId: 2,
      ingredientName: "토마토",
      ingredientQuantity: 60,
      expirationDate: 16,
      storage: "Fridge",
      purchaseDate: "2024-02-01",
    },
  ],
  roomTemp: [
    {
      userIngredientId: 23512,
      categoryId: 3,
      ingredientName: "사과",
      ingredientQuantity: 30,
      expirationDate: 10,
      storage: "Room Temp",
      purchaseDate: "2023-08-20",
    },
  ],
};

export const initialIngrdientEmptyData: IngredientData = {
  freezer: [],
  fridge: [],
  roomTemp: [],
};

export const initialIngrdientItems = [
  {
    userIngredientId: 4123432,
    categoryId: 9,
    ingredientName: "맛소금",
    ingredientQuantity: 2,
    expirationDate: 16,
    storage: "roomTemp",
    purchaseDate: "2024-01-15",
  },
];

export const initialIngrdientItem = {
  userIngredientId: 321342,
  categoryId: 8,
  ingredientName: "식용유",
  ingredientQuantity: 50,
  expirationDate: 30,
  storage: "roomTemp",
  purchaseDate: "2025-02-10",
};

export const initialIngredientRegisterData: RegisterIngredientData = {
  storeName: "",
  purchaseAt: "",
  userIngredients: [
    {
      ingredientName: "",
      productPrice: 0,
      categoryId: 1,
      expirationDate: "",
      ingredientStorage: "FRIDGE",
    },
  ],
};
