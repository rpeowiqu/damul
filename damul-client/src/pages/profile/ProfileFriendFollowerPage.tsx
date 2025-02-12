import { useOutletContext, useParams } from "react-router-dom";
import { getFollowers } from "@/service/user";
import FriendItem, { FriendItemProps } from "@/components/profile/FriendItem";
import DamulInfiniteScrollList from "@/components/common/DamulInfiniteScrollList";
import DamulButton from "@/components/common/DamulButton";

const ProfileFriendFollowerPage = () => {
  const { userId } = useParams();
  // const { searchTerm } = useOutletContext();

  const fetchFollowers = async (pageParam: number) => {
    try {
      const response = await getFollowers(parseInt(userId!), {
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

  return (
    <DamulInfiniteScrollList
      queryKey={["follower"]}
      fetchFn={fetchFollowers}
      renderItems={(item: FriendItemProps) => (
        <FriendItem key={item.userId} {...item}>
          <DamulButton
            variant="positive"
            className="h-7 sm:h-10 text-xs xs:text-sm"
            onClick={() => {}}
          >
            채팅 시작
          </DamulButton>
          <DamulButton
            variant="negative"
            className="h-7 sm:h-10 text-xs xs:text-sm"
            onClick={() => {}}
          >
            친구 삭제
          </DamulButton>
        </FriendItem>
      )}
    />
  );
};

export default ProfileFriendFollowerPage;
