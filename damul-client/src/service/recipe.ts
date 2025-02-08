import { apiClient, apiRequest } from "./http";

// 임시 토큰
const token =
  "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ6eXUyMkBuYXZlci5jb20iLCJyb2xlcyI6W3siYXV0aG9yaXR5IjoiUk9MRV9VU0VSIn1dLCJpYXQiOjE3MzkwMzA1OTMsImV4cCI6MTczOTAzNDE5M30.vDe5LdwLAmEjd3Ir_vxjCSKvYkkDWn3YKENU2a3qoYELejh5c0Y5lKkssg0LlICAmPwQnR7pb2ehTF_iFHvRrA";

// 레시피 검색 및 전체조회
export const getRecipes = async ({
  cursor = "0",
  size = "10",
  searchType,
  keyword,
  orderBy,
}: {
  cursor?: string;
  size?: string;
  searchType?: string;
  keyword?: string;
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
  if (orderBy) {
    params.append("orderBy", orderBy);
  }

  return apiRequest(() => apiClient.get(`/recipes?${params.toString()}`));
};

// 레시피 상세조회
export const getRecipeDetail = async (recipeId: string | undefined) => {
  return apiRequest(() => apiClient.get(`/recipes/${recipeId}`));
};

// 인기 레시피 조회
export const getPoppularRecipes = async () => {
  return apiRequest(() => apiClient.get("recipes/famous"));
};

// 레시피 작성
export const postRecipe = async () => {
  return apiRequest(() => apiClient.post("recipes"));
};

// 레시피 좋아요
export const postRecipeLike = async (recipeId: string | undefined) => {
  return apiRequest(() => apiClient.post(`recipes/${recipeId}/likes`));
};
