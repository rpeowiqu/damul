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

export interface Comment {
  id: number;
  userId: number;
  nickname: string;
  profileImageUrl: string;
  comment: string;
  createdAt: string;
  parentId?: number;
}
