import { Link } from "react-router-dom";
import ChattingListItem from "./ChattingListItem";

interface ChattingListProps {
  keyword?: string;
}

const ChattingList = ({ keyword }: ChattingListProps) => {
  const mockData = {
    data: [
      {
        id: 1,
        title:
          "역삼역 토마토 공구ㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁ",
        thumbnailUrl: "string",
        memberNum: 3,
        lastMessage:
          "토요일에 만나요ㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁ",
        lastMessageTime: "오후 1:46",
        unReadNum: 0,
      },
      {
        id: 2,
        title: "역삼역 토마토 공구",
        thumbnailUrl: "string",
        memberNum: 3,
        lastMessage: "토요일에 만나요",
        lastMessageTime: "오후 1:46",
        unReadNum: 3,
      },
    ],
    meta: {
      nextCursor: 10,
      hasNext: true,
    },
  };

  return (
    <div className="border-b-1">
      {mockData.data.map((data) => (
        <Link to={`/chatting/${data.id}`} key={data.id}>
          <ChattingListItem keyword={keyword} {...data} />
        </Link>
      ))}
    </div>
  );
};

export default ChattingList;
