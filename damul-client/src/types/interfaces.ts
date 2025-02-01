export interface IngredientProps {
  id: number;
  name: string;
  quantity: string;
  unit: string;
}

export interface OrderProps {
  id: number;
  description: string;
  image: File | null;
}
