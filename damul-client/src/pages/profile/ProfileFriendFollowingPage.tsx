import { useOutletContext, useParams } from "react-router-dom";
import { getFollowings } from "@/service/user";
import FriendItem, { FriendItemProps } from "@/components/profile/FriendItem";
import DamulInfiniteScrollList from "@/components/common/DamulInfiniteScrollList";
import DamulButton from "@/components/common/DamulButton";

const ProfileFriendFollowingPage = () => {
  const { userId } = useParams();
  // const { searchTerm } = useOutletContext();

  const fetchData = async (pageParam: number) => {
    const response = await getFollowings(parseInt(userId!), {
      cursor: pageParam,
      size: 5,
    });
    console.log(response);
    if (response?.status === 204) {
      return { data: [], meta: { nextCursor: null, hasNext: false } };
    }

    return response?.data;
  };

  return (
    <DamulInfiniteScrollList
      queryKey={["following"]}
      fetchFn={fetchData}
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
            언팔로우
          </DamulButton>
        </FriendItem>
      )}
    />
  );
};

export default ProfileFriendFollowingPage;
