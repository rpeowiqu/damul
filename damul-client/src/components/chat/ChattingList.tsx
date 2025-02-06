import ChattingListItem from "./ChattingListItem";

const ChattingList = () => {
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
      {
        id: 3,
        title: "역삼역 토마토 공구",
        thumbnailUrl: "string",
        memberNum: 3,
        lastMessage: "토요일에 만나요",
        lastMessageTime: "오후 1:46",
        unReadNum: 3,
      },
      {
        id: 4,
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
        id: 5,
        title: "역삼역 토마토 공구",
        thumbnailUrl: "string",
        memberNum: 3,
        lastMessage: "토요일에 만나요",
        lastMessageTime: "오후 1:46",
        unReadNum: 3,
      },
      {
        id: 6,
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
        <ChattingListItem key={data.id} {...data} />
      ))}
    </div>
  );
};

export default ChattingList;
