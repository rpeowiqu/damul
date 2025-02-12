import apiClient from "./http";

// 레시피 상세조회
export const getChattingList = async ({
  cursor = 0,
  size = 5,
}: {
  cursor?: number;
  size?: number;
}) => {
  return apiClient.get(`chats/rooms?cursor=${cursor}&size=${size}`);
};

// 채팅방 내용조회
export const getChattingContents = async ({
  roomId,
  cursor = 0,
  size = 5,
}: {
  roomId: string;
  cursor?: number;
  size?: number;
}) => {
  return apiClient.get(`chats/rooms/${roomId}?cursor=${cursor}&size=${size}`);
};

// 채팅방 검색
export const getSearchedChattingList = async ({
  keyword,
  cursor = 0,
  size = 5,
}: {
  keyword: string;
  cursor?: number;
  size?: number;
}) => {
  return apiClient.get(
    `chats/search?cursor=${cursor}&size=${size}&keyword=${keyword}`,
  );
};

// 채팅방 멤버 목록 조회
export const getChattingMembers = async ({ roomId }: { roomId: number }) => {
  return apiClient.get(`chats/rooms/${roomId}/members`);
};

// 채팅방 나가기
export const deleteFromChattingRoom = async ({
  roomId,
}: {
  roomId: number;
}) => {
  return apiClient.delete(`chats/rooms/${roomId}`);
};

// 채팅방 멤버 추방
export const deleteMember = async ({
  roomId,
  memberId,
}: {
  roomId: number;
  memberId: number;
}) => {
  return apiClient.delete(`chats/rooms/${roomId}/members/${memberId}`);
};

// 메세지 읽음 처리

// 안 읽은 메세지 수 조회
export const getunreads = async () => {
  return apiClient.delete(`chats/unreads`);
};

// 공구나눔 채팅방 입장하기
export const postIntoMarketRoom = async ({ roomId }: { roomId: number }) => {
  return apiClient.post(`chats/rooms/${roomId}`);
};

// 일대일 채팅 입장
export const postIntoPrivateRoom = async ({ userId }: { userId: number }) => {
  return apiClient.post(`chats/direct/${userId}`);
};

// 단체 채팅 생성
export const postIntoGroupRoom = async ({ users }: { users: number[] }) => {
  return apiClient.post(`chats/rooms`, { users });
};
