import { Link, useOutletContext } from "react-router-dom";

import DamulButton from "@/components/common/DamulButton";
import Image from "@/components/common/Image";
import defaultProfile from "@/assets/profile.png";

const followerDummyData = [
  {
    id: 1,
    nickname: "토마토러버전종우",
    profileImage: defaultProfile,
  },
  {
    id: 2,
    nickname: "사과러버윤서희",
    profileImage: defaultProfile,
  },
  {
    id: 3,
    nickname: "바나나러버신성우",
    profileImage: defaultProfile,
  },
  {
    id: 4,
    nickname: "포도러버한재서",
    profileImage: defaultProfile,
  },
  {
    id: 5,
    nickname: "망고러버지유림",
    profileImage: defaultProfile,
  },
  {
    id: 6,
    nickname: "레몬러버윤혜진",
    profileImage: defaultProfile,
  },
  {
    id: 7,
    nickname: "토마토맛토토맛토",
    profileImage: defaultProfile,
  },
  {
    id: 8,
    nickname: "안녕하세염",
    profileImage: defaultProfile,
  },
  {
    id: 9,
    nickname: "스크롤바화긴용",
    profileImage: defaultProfile,
  },
];

const FriendFollowerPage = () => {
  const { searchTerm } = useOutletContext();

  return (
    <div className="flex flex-col">
      {followerDummyData
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
            <Link
              to={`/profile/${item.id}/info`}
              className="flex-1 line-clamp-1"
            >
              {item.nickname}
            </Link>
            <div className="flex justify-center gap-3">
              <DamulButton variant="positive" onClick={() => {}}>
                채팅 시작
              </DamulButton>
              <DamulButton variant="positive" onClick={() => {}}>
                친구 삭제
              </DamulButton>
            </div>
          </div>
        ))}
    </div>
  );
};

export default FriendFollowerPage;
