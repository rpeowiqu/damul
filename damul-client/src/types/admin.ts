export interface Report {
  id: number;
  nickname: string;
  categoryName: string;
  description: string;
  status: string;
}

export interface User {
  userId: number;
  nickname: string;
  email: "string";
}

export interface RecipePost {
  id: number;
  nickname: string;
  description: string;
}

export interface SharePost {
  id: number;
  title: string;
  nickname: string;
  postType: string;
  status: string;
}
