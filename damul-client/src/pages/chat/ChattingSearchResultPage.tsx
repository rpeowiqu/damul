import { useNavigate, useParams } from "react-router-dom";
import DamulSearchBox from "@/components/common/DamulSearchBox";
import ChattingList from "@/components/chat/ChattingList";
import PostButton from "@/components/community/PostButton";
import PlusIcon from "@/components/svg/PlusIcon";

const ChattingSearchResultPage = () => {
  const navigate = useNavigate();
  const { keyword } = useParams<{ keyword: string }>();

  const mockData = {
    cnt: 3,
  };

  return (
    <main className="h-full text-center py-6 space-y-2">
      <div className="px-4 space-y-4">
        <DamulSearchBox
          placeholder={keyword}
          onInputClick={() => {
            navigate("/chatting/search");
          }}
          className="cursor-pointer"
        />
        <div className="flex items-center text-sm pc:text-md gap-1">
          <p className="text-positive-500 pc:text-lg">"{keyword}"</p>
          <p>에 대한</p>
          {mockData.cnt}개의 검색 결과
        </div>
      </div>
      <ChattingList keyword={keyword} />
      <PostButton to="/chatting/create" icon={<PlusIcon />} />
    </main>
  );
};

export default ChattingSearchResultPage;
