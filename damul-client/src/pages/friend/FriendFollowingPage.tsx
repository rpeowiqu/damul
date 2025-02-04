import { useOutletContext } from "react-router-dom";

import DamulButton from "@/components/common/DamulButton";
import Image from "@/components/common/Image";
import defaultProfile from "@/assets/profile.png";

const followingDummyData = [
  {
    id: 1,
    nickname: "볼빨간사춘기",
    profileImage: defaultProfile,
  },
];

const FriendFollowingPage = () => {
  const { searchTerm } = useOutletContext();

  return (
    <div className="flex flex-col">
      {followingDummyData
        .filter((item) =>
          item.nickname.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        .map((item) => (
          <div
            className="flex items-center gap-8 h-20 px-10 border-b border-normal-100"
            key={item.id}
          >
            <div className="h-16 rounded-full overflow-hidden border border-normal-100">
              <Image src={defaultProfile} className="h-full object-cover" />
            </div>
            <p className="flex-1 line-clamp-1">{item.nickname}</p>
            <div className="flex justify-center gap-3">
              <DamulButton variant="positive" onClick={() => {}}>
                채팅 시작
              </DamulButton>
              <DamulButton variant="positive" onClick={() => {}}>
                언팔로우
              </DamulButton>
            </div>
          </div>
        ))}
    </div>
  );
};

export default FriendFollowingPage;
