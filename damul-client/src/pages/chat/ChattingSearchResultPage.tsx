import { useNavigate, useSearchParams } from "react-router-dom";
import DamulSearchBox from "@/components/common/DamulSearchBox";
import PostButton from "@/components/community/PostButton";
import PlusIcon from "@/components/svg/PlusIcon";
import { getSearchedChattingList } from "@/service/chatting";
import ChattingListInfiniteScroll from "@/components/chat/ChattingListInfiniteScroll";
import ChattingListItem from "@/components/chat/ChattingListItem";
import { ChattingItem } from "@/types/chatting";

const ChattingSearchResultPage = () => {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";

  const mockData = {
    cnt: 3,
  };

  const fetchItems = async (pageParam: {
    cursor: number;
    cursorTime?: string;
  }) => {
    try {
      const response = await getSearchedChattingList({
        keyword: keyword,
        cursorTime: pageParam.cursorTime ?? new Date().toISOString(),
        cursor: pageParam.cursor ?? 0,
        size: 10,
      });
      console.log(response?.data);

      return response?.data;
    } catch (error) {
      console.log(error);
    }
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
      <ChattingListInfiniteScroll
        queryKey={["chattRooms"]}
        fetchFn={fetchItems}
        renderItems={(item: ChattingItem) => <ChattingListItem {...item} />}
        skeleton={
          <div className="h-24 mb-2 animate-pulse bg-normal-100 rounded" />
        }
      />
      <PostButton to="/chatting/create" icon={<PlusIcon />} />
    </main>
  );
};

export default ChattingSearchResultPage;
