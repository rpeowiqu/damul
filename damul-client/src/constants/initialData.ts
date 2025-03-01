import {
  IngredientData,
  RegisterIngredient,
  RegisterIngredientData,
} from "@/types/Ingredient";

export const initialIngrdientData: IngredientData = {
  freezer: [
    {
      userIngredientId: 4234,
      categoryId: 1,
      ingredientName: "쌀",
      ingredientQuantity: 50,
      expirationDate: 10,
      storage: "freezer",
      purchaseDate: new Date().toISOString().split("T")[0],
    },
  ],
  fridge: [
    {
      userIngredientId: 532446,
      categoryId: 2,
      ingredientName: "토마토",
      ingredientQuantity: 60,
      expirationDate: 16,
      storage: "fridge",
      purchaseDate: new Date().toISOString().split("T")[0],
    },
  ],
  roomTemp: [
    {
      userIngredientId: 23512,
      categoryId: 2,
      ingredientName: "사과",
      ingredientQuantity: 30,
      expirationDate: 10,
      storage: "roomTemp",
      purchaseDate: new Date().toISOString().split("T")[0],
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
    categoryId: 6,
    ingredientName: "맛소금",
    ingredientQuantity: 20,
    expirationDate: 16,
    storage: "roomTemp",
    purchaseDate: new Date().toISOString().split("T")[0],
  },
];

export const initialIngrdientItem = {
  userIngredientId: 321342,
  categoryId: 3,
  ingredientName: "식용유",
  ingredientQuantity: 50,
  expirationDate: 30,
  storage: "roomTemp",
  purchaseDate: new Date().toISOString().split("T")[0],
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

export const initialRegisterIngredient: RegisterIngredient = {
  id: Math.floor(Math.random() * 100000),
  ingredientName: "",
  productPrice: 0,
  categoryId: 1,
  expirationDate: "",
  ingredientStorage: "FREEZER",
};
