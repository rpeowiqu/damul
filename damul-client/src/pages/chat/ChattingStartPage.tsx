import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import SearchIcon from "@/components/svg/SearchIcon";
import Image from "@/components/common/Image";
import { getFollowings } from "@/service/user";
import useAuth from "@/hooks/useAuth";
import DamulInfiniteScrollList from "@/components/common/DamulInfiniteScrollList";
import { FriendItemProps } from "@/components/profile/FriendItem";
import { postIntoPrivateRoom, postIntoGroupRoom } from "@/service/chatting";
import DamulButton from "@/components/common/DamulButton";
import { Friend } from "@/types/chatting";
import DamulSection from "@/components/common/DamulSection";

const ChattingStartPage = () => {
  const [inputValue, setInputValue] = useState("");
  const [selectedFriends, setSelectedFriends] = useState<Friend[]>([]);
  const { data, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const fetchFollowings = async (pageParam: number) => {
    try {
      const response = await getFollowings(parseInt(data?.data.id), {
        cursor: pageParam,
        size: 10,
      });
      // console.log(response?.data);
      return response?.status === 204
        ? { data: [], meta: { nextCursor: null, hasNext: false } }
        : response?.data;
    } catch (error) {
      // console.error("Failed to fetch followings:", error);
      return { data: [], meta: { nextCursor: null, hasNext: false } };
    }
  };

  const toggleSelection = (id: number, nickname: string) => {
    if (selectedFriends.length >= 10) {
      alert("최대 10명까지 초대가 가능합니다.");
      return;
    }
    setSelectedFriends((prev) =>
      prev.some((friend) => friend.id === id)
        ? prev.filter((friend) => friend.id !== id)
        : [...prev, { id, nickname }],
    );
  };

  const removeSelectedFriend = (event: React.MouseEvent, id: number) => {
    event.stopPropagation();
    setSelectedFriends((prev) => prev.filter((friend) => friend.id !== id));
  };

  const handleStartPrivateChat = async (userId: number) => {
    try {
      const response = await postIntoPrivateRoom({ userId });
      const chatRoomId = response.data.id;
      navigate(`/chatting/${chatRoomId}`);
    } catch (error) {
      // console.log(error);
    }
  };

  const handleStartMultiChat = async (users: Friend[]) => {
    try {
      const response = await postIntoGroupRoom({ users });
      const chatRoomId = response.data.id;
      navigate(`/chatting/${chatRoomId}`);
    } catch (error) {
      // console.log(error);
    }
  };

  const onClickStartChat = () => {
    if (selectedFriends.length === 1) {
      handleStartPrivateChat(selectedFriends[0].id);
    } else if (selectedFriends.length > 1) {
      handleStartMultiChat(
        selectedFriends.map((friend) => ({
          id: friend.id,
          nickname: friend.nickname,
        })),
      );
    }
  };

  return (
    <DamulSection>
      <div className="flex justify-between items-center">
        <div>{selectedFriends.length}명 선택</div>
        <DamulButton
          onClick={onClickStartChat}
          variant={`${selectedFriends.length > 0 ? "positive" : "normal"}`}
          disabled={selectedFriends.length === 0}
          className="h-8"
        >
          채팅 시작
        </DamulButton>
      </div>
      {selectedFriends.length > 0 && (
        <div className="flex gap-2 py-3 whitespace-nowrap overflow-auto no-scrollbar">
          {selectedFriends.map((friend) => (
            <div
              key={friend.id}
              className="flex items-center bg-primary-200 text-primary-700 px-3 py-0.5 rounded-full text-xs bg-neutral-200"
            >
              {friend.nickname}
              <button
                onClick={(event) => removeSelectedFriend(event, friend.id)}
                className="ml-1 p-1 rounded-full hover:bg-primary-300"
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="relative">
        <Input
          placeholder="친구 검색"
          className="rounded-lg transition-colors p-2 pr-8 pc:pl-4 pc:pr-10 bg-normal-50 border border-normal-100 text-sm text-normal-700 focus:border-normal-500"
          onChange={handleInputChange}
          value={inputValue}
        />
        <button type="button" className="absolute inset-y-2 right-2 pc:right-3">
          <SearchIcon className="fill-normal-300" />
        </button>
      </div>

      <DamulInfiniteScrollList
        queryKey={["following"]}
        fetchFn={fetchFollowings}
        renderItems={(item: FriendItemProps) => (
          <div
            key={item.userId}
            className="flex items-center justify-between p-2 pc:p-3 rounded-lg cursor-pointer hover:bg-neutral-100"
            onClick={() => toggleSelection(item.userId, item.nickname)}
          >
            <div className="flex items-center gap-3">
              <Image
                src={item.profileImageUrl}
                className="w-12 h-12 rounded-full border border-normal-50"
              />
              <p className="text-normal-700">{item.nickname}</p>
            </div>
            <input
              type="radio"
              checked={selectedFriends.some(
                (friend) => friend.id === item.userId,
              )}
              className="size-4 pc:size-5 accent-lime-600 outline-none focus:ring-0"
              readOnly
            />
          </div>
        )}
      />
    </DamulSection>
  );
};

export default ChattingStartPage;
