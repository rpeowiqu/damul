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

export interface Post {
  id: number;
  nickname: string;
  description: string;
}
