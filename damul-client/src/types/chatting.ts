export interface ChattingItem {
  id: number;
  title: string;
  thumbnailUrl: string;
  memberNum: number;
  lastMessage: string;
  lastMessageTime: string;
  unReadNum: number;
}

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
  roomId?: number;
  senderId: number;
  profileImageUrl?: string | undefined;
  nickname?: string;
  messageType: "TEXT" | "IMAGE" | "SYSTEM" | "FILE";
  content?: string;
  image?: string;
  createdAt: string;
  unReadCount?: number;
  fileUrl?: string;
}

export interface ChatResponse {
  data: ChatMessage[];
  meta: {
    nextCursor: number;
    hasNext: boolean;
  };
}

export interface ChattingMember {
  id: number;
  nickname: string;
  profileImageUrl: string;
}

export interface Friend {
  id: number;
  nickname: string;
}
