import { useNavigate } from "react-router-dom";
import DamulSearchBox from "@/components/common/DamulSearchBox";
import ChattingListInfo from "@/components/chat/ChattingListInfo";
import ChattingList from "@/components/chat/ChattingList";
import PostButton from "@/components/community/PostButton";
import PlusIcon from "@/components/svg/PlusIcon";
import WebSocketComponent from "./WebSocketComponent";
import { getChattingList } from "@/service/chatting";
import DamulInfiniteScrollList from "@/components/common/DamulInfiniteScrollList";
import ChattingListItem from "@/components/chat/ChattingListItem";

interface ChattingItem {
  id: number;
  title: string;
  thumbnailUrl: string;
  memberNum: number; // 채팅방 인원 수
  lastMessage: string;
  lastMessageTime: string;
  unReadNum: number; //
}

const ChattingMainPage = () => {
  const navigate = useNavigate();

  const mockData = {
    cnt: 3,
  };

  const fetchItems = async (pageParam: number) => {
    try {
      const response = await getChattingList({
        cursor: pageParam,
        size: 5,
      });
      console.log(response?.data);
      return response?.data;
    } catch (error) {
      console.log(error);
    }
  };

  fetchItems(0);

  return (
    <main className="h-full text-center py-6 space-y-2">
      <div className="px-4 space-y-2">
        <DamulSearchBox
          placeholder="채팅방 검색"
          onInputClick={() => {
            navigate("/chatting/search");
          }}
          className="cursor-pointer"
        />
        <ChattingListInfo chattingCnt={mockData.cnt} />
      </div>
      {/* <DamulInfiniteScrollList
        queryKey={["chattRooms"]}
        fetchFn={fetchItems}
        renderItems={(item: ChattingItem) => (
          <ChattingListItem
            title={item.title}
            thumbnailUrl={item.thumbnailUrl}
            memberNum={item.memberNum}
            lastMessage={item.lastMessage}
            lastMessageTime={item.lastMessageTime}
            unReadNum={item.unReadNum}
          />
        )}
        skeleton={
          <div className="h-24 mb-2 animate-pulse bg-normal-100 rounded" />
        }
      /> */}
      <ChattingList />
      <PostButton to="/chatting/create" icon={<PlusIcon />} />
      {/* <WebSocketComponent /> */}
    </main>
  );
};

export default ChattingMainPage;
