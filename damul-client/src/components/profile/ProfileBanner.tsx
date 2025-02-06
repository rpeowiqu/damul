import Image from "@/components/common/Image";
import defaultProfile from "@/assets/profile.png";
import defaultProfileBg from "@/assets/profile-background.jpg";
import SearchIcon from "../svg/SearchIcon";
import DamulButton from "../common/DamulButton";
import { useState } from "react";
import DamulSearchBox from "../common/DamulSearchBox";

interface ProfileBannerProps {
  nickname: string;
  imageUrl?: string;
  bgImageUrl?: string;
}

const ProfileBanner = ({
  nickname,
  imageUrl,
  bgImageUrl,
}: ProfileBannerProps) => {
  const [searchActive, setSearchActive] = useState<boolean>();

  return (
    <div>
      <DamulSearchBox
        className="rounded-none bg-normal-50 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
        placeholder="유저 검색"
      />

      <div className="relative w-full h-44 select-none">
        <Image
          src={bgImageUrl ? bgImageUrl : defaultProfileBg}
          className="w-full h-full object-cover"
        />

        {/* <div
          className={`flex items-center gap-1 absolute top-0 left-0 rounded-full bg-white border border-normal-100
transition-all duration-300 ease-in-out overflow-hidden ${searchActive ? "w-full" : "w-6"}`}
        >
          <button onClick={() => setSearchActive((prev) => !prev)}>
            <SearchIcon className="size-6 fill-positive-300" />
          </button>
          <input
            type="text"
            className="text-sm flex-1 outline-none"
            placeholder="유저 닉네임을 입력해 주세요."
          />
        </div> */}

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-4 border-normal-50 bg-white overflow-hidden">
          <Image
            src={imageUrl ? imageUrl : defaultProfile}
            className="w-full h-full"
          />
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 bottom-2 bg-white shadow-md rounded-full px-3 font-bold">
          {nickname}
        </div>
      </div>
    </div>
  );
};

export default ProfileBanner;
