export interface IngredientProps {
  id: number;
  name: string;
  amount: string;
  unit: string;
}

export interface OrderProps {
  id: number;
  content: string;
  imageUrl: File | null;
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
