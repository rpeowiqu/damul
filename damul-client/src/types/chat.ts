export interface ChattingListItemProps {
  id: number;
  title: string;
  thumbnailUrl: string;
  memberNum: number;
  lastMessage: string;
  lastMessageTime: string;
  unReadNum: number;
  keyword?: string;
}

export interface ChatMessage {
  id: number;
  roomId: number;
  senderId: number;
  profileImageUrl: string;
  nickname: string;
  messageType: "TEXT" | "IMAGE";
  content: string;
  fileUrl?: string;
  createdAt: string;
  unReadCount: number;
}

export interface ChatResponse {
  data: ChatMessage[];
  meta: {
    nextCursor: number;
    hasNext: boolean;
  };
}
