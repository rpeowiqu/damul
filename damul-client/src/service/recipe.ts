import { apiClient, apiRequest } from "./http";

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
  return apiRequest(() =>
    apiClient.get(`/recipes/${recipeId}`, {
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJqMnkybDJAbmF2ZXIuY29tIiwicm9sZXMiOlt7ImF1dGhvcml0eSI6IlJPTEVfVVNFUiJ9XSwiaWF0IjoxNzM5MDIzNzYwLCJleHAiOjE3MzkwMjM3OTB9.7EkxUBDtvMgyw3VMOjZqC0jE3QFBI8KaqQBQL6xm1OsITnzum_cz1uvatp9fGQynz4V-4Y-wUX4DL_IWr7zOWw",
      },
    }),
  );
};

// 인기 레시피 조회
export const getPoppularRecipes = async () => {
  return apiRequest(() => apiClient.get("recipes/famous"));
};

// 레시피 작성
export const postRecipe = async () => {
  return apiRequest(() => apiClient.post("recipes"));
};
