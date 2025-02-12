import apiClient from "./http";

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

  return apiClient.get(`/posts?${params.toString()}`);
};

// 게시글 상세조회
export const getPostDetail = async (postId: string | undefined) => {
  return apiClient.get(`/posts/${postId}`);
};

// 게시글 작성
export const postPost = async (formData: FormData) => {
  return apiClient.post("posts", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 게시글 삭제
export const deletePost = async ({
  postId,
}: {
  postId: string | undefined;
}) => {
  return apiClient.delete(`/posts/${postId}`);
};

// 게시글 댓글 작성
export const postPostComment = async ({
  postId,
  comment,
  parentId,
}: {
  postId: string;
  comment: string;
  parentId?: number;
}) => {
  return apiClient.post(`posts/${postId}/comments`, {
    comment,
    ...(parentId !== undefined && { parentId }),
  });
};

// 게시글  댓글 삭제
export const deletePostComment = async ({
  postId,
  commentId,
}: {
  postId: string;
  commentId: number;
}) => {
  return apiClient.delete(`/posts/${postId}/comments/${commentId}`);
};

// 게시글 현황 변경
export const putPostStatusChange = async ({
  postId,
}: {
  postId: string | undefined;
}) => {
  return apiClient.put(`/posts/${postId}/status`);
};
