import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DamulSearchBox from "@/components/common/DamulSearchBox";
import ChattingListInfo from "@/components/chat/ChattingListInfo";
import PostButton from "@/components/community/PostButton";
import { getChattingList } from "@/service/chatting";
import ChattingListInfiniteScroll from "@/components/chat/ChattingListInfiniteScroll";
import ChattingListItem from "@/components/chat/ChattingListItem";
import { ChattingItem } from "@/types/chatting";
import { getKSTISOString } from "@/utils/date";

const ChattingMainPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const filterType = searchParams.get("filter") || "";

  const navigate = useNavigate();

  const fetchItems = async (pageParam: {
    cursor: number;
    cursorTime?: string;
  }) => {
    try {
      const response = await getChattingList({
        cursorTime: pageParam.cursorTime ?? getKSTISOString(),
        cursor: pageParam.cursor ?? 0,
        size: 15,
        filter: filterType,
      });
      if (response.status === 204) {
        return { data: [], meta: { nextCursor: 0, hasNext: 0 } };
      }
      return response?.data;
    } catch (error) {
      console.error("Error fetching chat list:", error);
    }
  };

  return (
    <div className="h-full text-center py-6 space-y-2">
      <div className="px-4 pc:px-6 space-y-2">
        <DamulSearchBox
          placeholder="채팅방 검색"
          onInputClick={() => {
            navigate("/chatting/search");
          }}
          className="cursor-pointer"
        />
        <ChattingListInfo />
        <PostButton to="/chatting/create" icon={"+"} />
      </div>
      <ChattingListInfiniteScroll
        queryKey={["chattRooms", filterType]}
        fetchFn={fetchItems}
        renderItems={(item: ChattingItem) => <ChattingListItem {...item} />}
        skeleton={
          <div className="h-24 mb-2 animate-pulse bg-normal-100 rounded" />
        }
        noContent={
          <p className="text-center text-normal-200">
            참여중인 채팅방이 없습니다.
          </p>
        }
      />
    </div>
  );
};

export default ChattingMainPage;
