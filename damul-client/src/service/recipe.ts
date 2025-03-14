import apiClient from "./http";

// 레시피 검색 및 전체조회
export const getRecipes = async ({
  cursor = 0,
  size = 5,
  searchType,
  keyword,
  orderBy,
}: {
  cursor?: number;
  size?: number;
  searchType?: string;
  keyword?: string;
  orderBy?: string;
}) => {
  const params = new URLSearchParams({
    cursor: cursor.toString(),
    size: size.toString(),
  });

  if (searchType) {
    params.append("searchType", searchType);
  }
  if (keyword) {
    params.append("keyword", keyword);
  }
  if (orderBy) {
    params.append("orderBy", orderBy);
  }

  return apiClient.get(`/recipes?${params.toString()}`);
};

// 레시피 상세조회
export const getRecipeDetail = async (recipeId: string | undefined) => {
  return apiClient.get(`/recipes/${recipeId}`);
};

// 인기 레시피 조회
export const getPoppularRecipes = async () => {
  return apiClient.get("recipes/famous");
};

// 레시피 작성
export const postRecipe = async (formData: FormData) => {
  return apiClient.post("recipes", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 레시피 수정
export const putRecipe = async ({
  formData,
  recipeId,
}: {
  formData: FormData;
  recipeId: string | undefined;
}) => {
  return apiClient.put(`recipes/${recipeId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 레시피 삭제
export const deleteRecipe = async ({
  recipeId,
}: {
  recipeId: string | undefined;
}) => {
  return apiClient.delete(`/recipes/${recipeId}`);
};

// 레시피 좋아요
export const postRecipeLike = async (recipeId: string | undefined) => {
  return apiClient.post(`recipes/${recipeId}/likes`);
};

// 레시피 북마크
export const postRecipeBookMark = async ({
  recipeId,
}: {
  recipeId: string | undefined;
}) => {
  return apiClient.post(`recipes/${recipeId}/bookmarks`);
};

// 레시피 댓글 작성
export const postRecipeComment = async ({
  recipeId,
  comment,
  parentId,
}: {
  recipeId: string;
  comment: string;
  parentId?: number;
}) => {
  const CommentCreate: Record<string, any> = { comment };

  if (parentId) {
    CommentCreate.parentId = parentId;
    // console.log(parentId);
  }

  // console.log(CommentCreate);

  return apiClient.post(`recipes/${recipeId}/comments`, CommentCreate);
};

// 레시피  댓글 삭제
export const deleteRecipeComment = async ({
  recipeId,
  commentId,
}: {
  recipeId: string;
  commentId: number;
}) => {
  // console.log(recipeId);
  return apiClient.delete(`/recipes/${recipeId}/comments/${commentId}`);
};
