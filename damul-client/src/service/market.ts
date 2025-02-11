import { apiClient, apiRequest } from "./http";

// 게시글 검색 및 전체조회
export const getPosts = async ({
  cursor = 0,
  size = 10,
  searchType,
  keyword,
  status,
  orderBy,
}: {
  cursor?: number;
  size?: number;
  searchType?: string;
  keyword?: string;
  status?: string | null;
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
  if (status) {
    params.append("status", status);
  }
  if (orderBy) {
    params.append("orderBy", orderBy);
  }

  return apiRequest(() => apiClient.get(`/posts?${params.toString()}`));
};

// 게시글 상세조회
export const getPostDetail = async (postId: string | undefined) => {
  return apiRequest(() => apiClient.get(`/posts/${postId}`));
};

// 게시글 작성
export const postPost = async () => {
  return apiRequest(() => apiClient.post("posts"));
};

// 게시글 삭제
export const deletePost = async (postId: string | undefined) => {
  return apiRequest(() => apiClient.delete(`/posts/${postId}`));
};

// 게시글 댓글 작성
export const postPostComment = async ({
  postId,
  authorId,
  comment,
  parentId,
}: {
  postId: string;
  authorId: string;
  comment: string;
  parentId?: string;
}) => {
  const CommentCreate: Record<string, any> = { authorId, comment };

  if (parentId) {
    CommentCreate.parentId = parentId;
  }

  return apiRequest(() =>
    apiClient.post(`posts/${postId}/comments`, {
      CommentCreate,
    }),
  );
};

// 게시글  댓글 삭제
export const deletePostComment = async (
  recipeId: string,
  commentId: number,
) => {
  return apiRequest(() =>
    apiClient.delete(`/posts/${recipeId}/comments/${commentId}`),
  );
};

// 게시글 현황 변경
export const putPostStatusChange = async (postId: string) => {
  return apiRequest(() => apiClient.put(`/posts/${postId}/status`));
};
