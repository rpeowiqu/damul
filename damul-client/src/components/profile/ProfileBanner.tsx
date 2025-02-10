import Image from "@/components/common/Image";
import defaultProfile from "@/assets/profile.png";
import defaultProfileBg from "@/assets/profile-background.jpg";
import DamulSearchBox from "../common/DamulSearchBox";
import { getUser } from "@/service/user";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const nav = useNavigate();

  const handleSearch = async (nickname: string) => {
    const response = await getUser(nickname);
    if (response) {
      nav(`/profile/${response.data.id}/info`);
    }
  };

  return (
    <div>
      <DamulSearchBox
        className="rounded-none bg-normal-50 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
        placeholder="유저 검색"
        onButtonClick={() => handleSearch(searchKeyword)}
        inputValue={searchKeyword}
        setInputValue={setSearchKeyword}
      />
      <div className="relative w-full h-44 select-none">
        <img
          src={bgImageUrl ? bgImageUrl : defaultProfileBg}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-4 border-normal-50 bg-white overflow-hidden">
          <img
            src={imageUrl ? imageUrl : defaultProfile}
            className="w-full h-full object-cover"
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
