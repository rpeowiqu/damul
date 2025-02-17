import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DamulSearchBox from "@/components/common/DamulSearchBox";
import PostButton from "@/components/community/PostButton";
import PlusIcon from "@/components/svg/PlusIcon";
import { getSearchedChattingList } from "@/service/chatting";
import ChattingListInfiniteScroll from "@/components/chat/ChattingListInfiniteScroll";
import ChattingListItem from "@/components/chat/ChattingListItem";
import { ChattingItem } from "@/types/chatting";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ChattingSearchResultPage = () => {
  const navigate = useNavigate();
  const [resultCnt, setResultCnt] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";

  const [sortType, setSortType] = useState("all");

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
      setResultCnt(response?.data.count);

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
        <div className="flex justify-between">
          <div className="flex items-center text-sm pc:text-md gap-1">
            <p className="text-positive-500 pc:text-lg">"{keyword}"</p>
            <p>에 대한</p>
            {resultCnt}개의 검색 결과
          </div>
          <Select
            value={sortType}
            onValueChange={(value) => setSortType(value)}
          >
            <SelectTrigger className="w-40 h-8 text-xs pc:text-sm">
              <SelectValue placeholder="채팅 보기" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel className="text-xs pc:text-sm">
                  채팅 보기
                </SelectLabel>
                <SelectItem
                  className="data-[highlighted]:bg-positive-50 data-[state=checked]:text-positive-500 text-xs pc:text-sm"
                  value="all"
                >
                  전체 채팅
                </SelectItem>
                <SelectItem
                  className="data-[highlighted]:bg-positive-50 data-[state=checked]:text-positive-500 text-xs pc:text-sm"
                  value="normal"
                >
                  일반 채팅
                </SelectItem>
                <SelectItem
                  className="data-[highlighted]:bg-positive-50 data-[state=checked]:text-positive-500 text-xs pc:text-sm"
                  value="market"
                >
                  공동구매/나눔 채팅
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <ChattingListInfiniteScroll
        queryKey={["chattRooms"]}
        fetchFn={fetchItems}
        renderItems={(item: ChattingItem) => (
          <ChattingListItem {...item} keyword={keyword} />
        )}
        skeleton={
          <div className="h-24 mb-2 animate-pulse bg-normal-100 rounded" />
        }
      />
      <PostButton to="/chatting/create" icon={<PlusIcon />} />
    </main>
  );
};

export default ChattingSearchResultPage;
