import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { getFollowings, toggleFollow } from "@/service/user";
import FriendItem, { FriendItemProps } from "@/components/profile/FriendItem";
import DamulInfiniteScrollList from "@/components/common/DamulInfiniteScrollList";
import DamulButton from "@/components/common/DamulButton";
import { useState } from "react";
import useAuth from "@/hooks/useAuth";
import { postIntoPrivateRoom } from "@/service/chatting";

const ProfileFriendFollowingPage = () => {
  const { data, isLoading } = useAuth();
  const { userId } = useParams();
  const { searchKeyword } = useOutletContext();
  const [checkSet, setCheckSet] = useState<Set<number>>(new Set());
  const nav = useNavigate();

  const enterPrivateChat = async (userId: number) => {
    try {
      const response = await postIntoPrivateRoom({ userId });
      if (response) {
        const chatId = response.data.id;
        nav(`/chatting/${chatId}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFollowings = async (pageParam: number) => {
    try {
      const response = await getFollowings(parseInt(userId!), {
        keyword: searchKeyword,
        cursor: pageParam,
        size: 10,
      });
      if (response?.status === 204) {
        return { data: [], meta: { nextCursor: null, hasNext: false } };
      }

      return response?.data;
    } catch (error) {
      console.error(error);
    }
  };

  const handleFollowState = async (userId: number) => {
    try {
      await toggleFollow({
        targetId: userId,
      });

      if (checkSet.has(userId)) {
        setCheckSet((prev) => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
      } else {
        setCheckSet((prev) => new Set(prev).add(userId));
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <DamulInfiniteScrollList
      queryKey={["following", userId, searchKeyword]}
      fetchFn={fetchFollowings}
      renderItems={(item: FriendItemProps) => (
        <FriendItem key={item.userId} {...item}>
          {data?.data.id === parseInt(userId!) && (
            <>
              <DamulButton
                variant="positive"
                className="sm:w-20 h-7 sm:h-10 text-xs sm:text-sm"
                onClick={() => enterPrivateChat(item.userId)}
              >
                채팅 시작
              </DamulButton>
              <DamulButton
                variant={checkSet.has(item.userId) ? "positive" : "negative"}
                className="sm:w-20 h-7 sm:h-10 text-xs sm:text-sm"
                onClick={() => handleFollowState(item.userId)}
              >
                {checkSet.has(item.userId) ? "팔로우" : "언팔로우"}
              </DamulButton>
            </>
          )}
        </FriendItem>
      )}
    />
  );
};

export default ProfileFriendFollowingPage;
