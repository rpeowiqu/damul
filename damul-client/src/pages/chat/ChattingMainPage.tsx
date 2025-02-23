import { useNavigate, useSearchParams } from "react-router-dom";
import DamulSearchBox from "@/components/common/DamulSearchBox";
import ChattingListInfo from "@/components/chat/ChattingListInfo";
import PostButton from "@/components/community/PostButton";
import { getChattingList } from "@/service/chatting";
import ChattingListInfiniteScroll from "@/components/chat/ChattingListInfiniteScroll";
import ChattingListItem from "@/components/chat/ChattingListItem";
import { ChattingItem } from "@/types/chatting";
import { getKSTISOString } from "@/utils/date";
import { useChatAlarmStore } from "@/stores/alarmStore";
import { useEffect } from "react";
import queryClient from "@/utils/queryClient";
import DamulSection from "@/components/common/DamulSection";
import WriteIcon from "@/components/svg/WriteIcon";

const ChattingMainPage = () => {
  const { chatCnt } = useChatAlarmStore();
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
        size: 10,
        filter: filterType,
      });

      // console.log(response?.data);
      if (response.status === 204) {
        return { data: [], meta: { nextCursor: 0, hasNext: 0 } };
      }
      return response?.data;
    } catch (error) {
      // console.error("Error fetching chat list:", error);
    }
  };

  useEffect(() => {
    // console.log("sds");
    queryClient.refetchQueries({
      queryKey: ["chattRooms", filterType],
    });
  }, [chatCnt]);

  return (
    <div>
      <DamulSection>
        <DamulSearchBox
          placeholder="채팅방 검색"
          onInputClick={() => {
            navigate("/chatting/search");
          }}
          className="cursor-pointer"
        />
        <ChattingListInfo />

        <ChattingListInfiniteScroll
          queryKey={["chattRooms", filterType]}
          fetchFn={fetchItems}
          renderItems={(item: ChattingItem) => (
            <ChattingListItem key={item.id} {...item} />
          )}
          skeleton={
            <div className="h-12 mb-2 animate-pulse bg-normal-100 rounded" />
          }
          noContent={
            <p className="text-center text-normal-200">
              참여중인 채팅방이 없습니다.
            </p>
          }
        />
      </DamulSection>

      <PostButton
        to="/chatting/create"
        icon=<WriteIcon className="scale-150 fill-positive-300" />
      />
    </div>
  );
};

export default ChattingMainPage;
