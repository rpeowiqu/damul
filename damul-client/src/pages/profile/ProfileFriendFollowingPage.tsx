import { Link, useOutletContext } from "react-router-dom";

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

const ProfileFriendFollowingPage = () => {
  const { searchTerm } = useOutletContext();

  return (
    <div className="flex flex-col">
      {followingDummyData
        .filter((item) =>
          item.nickname.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        .map((item) => (
          <div
            className="flex items-center gap-4 sm:gap-8 h-20 px-6 sm:px-8 pc:px-10 border-b border-normal-100"
            key={item.id}
          >
            <div className="h-16 rounded-full overflow-hidden border border-normal-100">
              <Image src={defaultProfile} className="h-full object-cover" />
            </div>
            <Link
              to={`/profile/${item.id}/info`}
              className="flex-1 line-clamp-1 text-sm xs:text-base hover:text-normal-500"
            >
              {item.nickname}
            </Link>
            <div className="flex flex-col sm:flex-row justify-center gap-2">
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
            </div>
          </div>
        ))}
    </div>
  );
};

export default ProfileFriendFollowingPage;
