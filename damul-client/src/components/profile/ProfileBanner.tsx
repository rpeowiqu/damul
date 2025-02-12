import defaultProfile from "@/assets/profile.png";
import defaultProfileBg from "@/assets/profile-background.jpg";
import DamulSearchBox from "../common/DamulSearchBox";
import DamulInfiniteScrollList from "../common/DamulInfiniteScrollList";
import { useState } from "react";
import { getUser } from "@/service/user";
import { UserSearchResult } from "@/types/profile";
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

  const handleSearchKeywordChange = async (pageParam: number) => {
    try {
      if (searchKeyword.length === 0) {
        return { data: [], meta: { nextCursor: null, hasNext: false } };
      }

      const response = await getUser({
        keyword: searchKeyword,
        cursor: pageParam,
        size: 4,
      });
      if (response.status === 204) {
        return { data: [], meta: { nextCursor: null, hasNext: false } };
      }

      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectSearchItem = (userId: number) => {
    setSearchKeyword("");
    nav(`/profile/${userId}/info`);
  };

  return (
    <div>
      <div className="relative z-50">
        <DamulSearchBox
          placeholder="찾으시는 유저의 닉네임을 입력해 주세요."
          inputValue={searchKeyword}
          setInputValue={setSearchKeyword}
          className="rounded-none focus:border-positive-400"
        />
        <DamulInfiniteScrollList
          queryKey={["users", searchKeyword]}
          fetchFn={handleSearchKeywordChange}
          renderItems={(item: UserSearchResult) => (
            <div
              key={item.userId}
              className="flex items-center gap-5 px-5 py-1 bg-white hover:bg-normal-50"
              onClick={() => handleSelectSearchItem(item.userId)}
            >
              <img
                src={item.profileImageUrl || defaultProfile}
                className="w-8 h-8 object-cover rounded-full border border-normal-100"
              />
              <p className="text-sm">{item.nickname}</p>
            </div>
          )}
          className="flex flex-col gap-1 absolute top-full bg-white w-full h-fit max-h-32 overflow-y-scroll shadow-md"
        />
      </div>

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
