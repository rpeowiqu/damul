export interface Ingredient {
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

export interface PostDetail {
  id: string;
  title: string;
  authorId: number;
  authorName: string;
  profileImageUrl: string;
  status: "ACTIVE" | "COMPLETED";
  contentImageUrl: string;
  content: string;
  createdAt: string;
  currentChatNum: number;
  chatSize: number;
  viewCnt: number;
  comments: Comment[];
}

export interface PostItem {
  id: number;
  title: string;
  thumbnailUrl: string;
  content: string;
  createdAt: string;
  authorId: number;
  authorName: string;
  status: string;
  viewCnt: number;
}

export interface CookingOrder {
  id: number;
  content: string;
  imageUrl: string;
}

export interface RecipeDetail {
  recipeId: string;
  title: string;
  bookmarked: boolean;
  liked: boolean;
  createdAt: string;
  authorId: number;
  authorName: string;
  profileImageUrl: string;
  viewCnt: number;
  likeCnt: number;
  content: string;
  contentImageUrl: string;
  ingredients: Ingredient[];
  cookingOrders: CookingOrder[];
  comments: Comment[];
}

export interface RecipeItem {
  id: number;
  title: string;
  thumbnailUrl: string;
  content: string;
  createdAt: string;
  authorId: number;
  nickname: string;
  bookmarked: boolean;
  likeCnt: number;
  liked: boolean;
  viewCnt: number;
}
