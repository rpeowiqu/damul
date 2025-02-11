import { useNavigate } from "react-router-dom";
import DamulSearchBox from "@/components/common/DamulSearchBox";
import ChattingListInfo from "@/components/chat/ChattingListInfo";
import ChattingList from "@/components/chat/ChattingList";
import PostButton from "@/components/community/PostButton";
import PlusIcon from "@/components/svg/PlusIcon";
import WebSocketComponent from "./WebSocketComponent";
const ChattingMainPage = () => {
  const navigate = useNavigate();

  const mockData = {
    cnt: 3,
  };

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
      <ChattingList />
      <PostButton to="/chatting/create" icon={<PlusIcon />} />
      <WebSocketComponent />
    </main>
  );
};

export default ChattingMainPage;
