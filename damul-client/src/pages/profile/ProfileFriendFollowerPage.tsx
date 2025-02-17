import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { deleteFollower, getFollowers } from "@/service/user";
import FriendItem, { FriendItemProps } from "@/components/profile/FriendItem";
import DamulInfiniteScrollList from "@/components/common/DamulInfiniteScrollList";
import DamulButton from "@/components/common/DamulButton";
import queryClient from "@/utils/queryClient";
import useAuth from "@/hooks/useAuth";
import { postIntoPrivateRoom } from "@/service/chatting";

const ProfileFriendFollowerPage = () => {
  const { data, isLoading } = useAuth();
  const { userId } = useParams();
  const { searchKeyword } = useOutletContext();
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

  const fetchFollowers = async (pageParam: number) => {
    try {
      const response = await getFollowers(parseInt(userId!), {
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

  const handleDeleteFriend = async (targetId: number) => {
    try {
      await deleteFollower(targetId);
      queryClient.refetchQueries({
        queryKey: ["follower", userId, searchKeyword],
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <DamulInfiniteScrollList
      queryKey={["follower", userId, searchKeyword]}
      fetchFn={fetchFollowers}
      renderItems={(item: FriendItemProps) => (
        <FriendItem key={item.userId} {...item}>
          {data?.data.id === parseInt(userId!) && (
            <>
              <DamulButton
                variant="positive"
                className="h-7 sm:h-10 text-xs xs:text-sm"
                onClick={() => enterPrivateChat(item.userId)}
              >
                채팅 시작
              </DamulButton>

              <DamulButton
                variant="negative"
                className="h-7 sm:h-10 text-xs xs:text-sm"
                onClick={() => handleDeleteFriend(item.userId)}
              >
                친구 삭제
              </DamulButton>
            </>
          )}
        </FriendItem>
      )}
    />
  );
};

export default ProfileFriendFollowerPage;
