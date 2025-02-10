import { apiClient, apiRequest } from "./http";

// 게시글 검색 및 전체조회
export const getRecipes = async ({
  cursor = "0",
  size = "10",
  searchType,
  keyword,
  status,
  orderBy,
}: {
  cursor?: string;
  size?: string;
  searchType?: string;
  keyword?: string;
  status?: string;
  orderBy?: string;
}) => {
  const params = new URLSearchParams({
    cursor,
    size,
  });

  if (searchType) {
    params.append("searchType", searchType);
  }
  if (keyword) {
    params.append("keyword", keyword);
  }
  if (status) {
    params.append("status", status);
  }
  if (orderBy) {
    params.append("orderBy", orderBy);
  }

  return apiRequest(() => apiClient.get(`/posts?${params.toString()}`));
};

// 게시글 상세조회
export const getRecipeDetail = async (postId: string | undefined) => {
  return apiRequest(() => apiClient.get(`/posts/${postId}`));
};

// 인기 레시피 조회
export const getPoppularRecipes = async () => {
  return apiRequest(() => apiClient.get("recipes/famous"));
};

// 레시피 작성
export const postRecipe = async () => {
  return apiRequest(() => apiClient.post("recipes"));
};

// 레시피 삭제
export const deleteRecipe = async (recipeId: string | undefined) => {
  return apiRequest(() => apiClient.delete(`/recipes/${recipeId}`));
};

// 레시피 좋아요
export const postRecipeLike = async (recipeId: string | undefined) => {
  return apiRequest(() => apiClient.post(`recipes/${recipeId}/likes`));
};

// 레시피 북마크
export const postRecipeBookMark = async (recipeId: string | undefined) => {
  return apiRequest(() => apiClient.post(`recipes/${recipeId}/bookmarks`));
};

// 레시피 댓글 작성
export const postRecipeComment = async ({
  recipeId,
  authorId,
  comment,
  parentId,
}: {
  recipeId: string;
  authorId: string;
  comment: string;
  parentId?: string;
}) => {
  const CommentCreate: Record<string, any> = { authorId, comment };

  if (parentId) {
    CommentCreate.parentId = parentId;
  }

  return apiRequest(() =>
    apiClient.post(`recipes/${recipeId}/comments`, {
      CommentCreate,
    }),
  );
};
