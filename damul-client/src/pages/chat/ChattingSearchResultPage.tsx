import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DamulSearchBox from "@/components/common/DamulSearchBox";
import PostButton from "@/components/community/PostButton";
import PlusIcon from "@/components/svg/PlusIcon";
import { getSearchedChattingList } from "@/service/chatting";
import ChattingListInfiniteScroll from "@/components/chat/ChattingListInfiniteScroll";
import ChattingListItem from "@/components/chat/ChattingListItem";
import { ChattingItem } from "@/types/chatting";
import DamulSection from "@/components/common/DamulSection";

const ChattingSearchResultPage = () => {
  const navigate = useNavigate();
  const [resultCnt, setResultCnt] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";

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
      if (response.status === 204) {
        return { data: [], meta: { nextCursor: 0, hasNext: 0 } };
      }
      setResultCnt(response?.data.count);
      return response?.data;
    } catch (error) {
      // console.log(error);
    }
  };

  return (
    <div>
      <DamulSection>
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
          noContent={
            <p className="text-center text-normal-200">
              검색 결과가 없습니다.{" "}
            </p>
          }
        />
      </DamulSection>

      <PostButton to="/chatting/create" icon={<PlusIcon />} />
    </div>
  );
};

export default ChattingSearchResultPage;
