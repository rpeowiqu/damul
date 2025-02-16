import apiClient from "./http";

// 모든 채팅 목록 조회
export const getChattingList = async ({
  cursorTime,
  cursor = 0,
  size = 5,
}: {
  cursorTime: string | Date;
  cursor?: number;
  size?: number;
}) => {
  return apiClient.get(
    `chats/rooms?cursorTime=${cursorTime}&cursor=${cursor}&size=${size}`,
  );
};

// 채팅방 내용조회
export const getChattingContents = async ({
  roomId,
  cursor = 0,
  size = 5,
}: {
  roomId: string | undefined;
  cursor?: number;
  size?: number;
}) => {
  return apiClient.get(`chats/rooms/${roomId}?cursor=${cursor}&size=${size}`);
};

// 채팅방 검색
export const getSearchedChattingList = async ({
  keyword,
  cursorTime,
  cursor = 0,
  size = 5,
}: {
  keyword: string;
  cursorTime: string;
  cursor?: number;
  size?: number;
}) => {
  return apiClient.get(
    `chats/search?keyword=${keyword}&cursorTime=${cursorTime}&cursor=${cursor}&size=${size}&`,
  );
};

// 채팅방 멤버 목록 조회
export const getChattingMembers = async ({
  roomId,
}: {
  roomId: string | undefined;
}) => {
  return apiClient.get(`chats/rooms/${roomId}/members`);
};

// 채팅방 나가기
export const deleteFromRoom = async ({
  roomId,
}: {
  roomId: string | undefined;
}) => {
  return apiClient.delete(`chats/rooms/${roomId}`);
};

// 채팅방 멤버 추방
export const deleteMemberFromRoom = async ({
  roomId,
  memberId,
}: {
  roomId: string | undefined;
  memberId: number;
}) => {
  return apiClient.delete(`chats/rooms/${roomId}/members/${memberId}`);
};

// 메세지 읽음 처리

// 안 읽은 메세지 수 조회
export const getUnreads = async () => {
  return apiClient.get(`chats/unreads`);
};

// 일대일 채팅 입장
export const postIntoPrivateRoom = async ({ userId }: { userId: number }) => {
  return apiClient.post(`chats/direct/${userId}`);
};

// 단체 채팅 생성
export const postIntoGroupRoom = async ({ users }: { users: number[] }) => {
  return apiClient.post(`chats/rooms`, { users });
};
