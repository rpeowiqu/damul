import defaultProfile from "@/assets/profile.png";
import defaultProfileBg from "@/assets/profile-background.jpg";
import DamulSearchBox from "../common/DamulSearchBox";
import DamulInfiniteScrollList from "../common/DamulInfiniteScrollList";
import { useCallback, useEffect, useState } from "react";
import { getUser } from "@/service/user";
import { UserSearchResult } from "@/types/profile";
import { useNavigate } from "react-router-dom";
import { debounce } from "@/utils/optimize";

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
  const [debouncedSearchKeyword, setDebouncedSearchKeyword] =
    useState<string>("");
  const nav = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // 리렌더링이 빈번하게 일어나서 추가
  const debouncedSetSearchKeyword = useCallback(
    debounce(
      "setProfileSearchKeyword",
      (keyword: string) => setDebouncedSearchKeyword(keyword),
      200,
    ),
    [],
  );

  useEffect(() => {
    debouncedSetSearchKeyword(searchKeyword);
  }, [searchKeyword]);

  const fetchUsers = async (pageParam: number) => {
    try {
      if (debouncedSearchKeyword.length === 0) {
        return { data: [], meta: { nextCursor: null, hasNext: false } };
      }

      const response = await getUser({
        keyword: debouncedSearchKeyword,
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

  return (
    <div>
      <div className="relative z-40">
        <DamulSearchBox
          placeholder="찾으시는 유저의 닉네임을 입력해 주세요."
          inputValue={searchKeyword}
          setInputValue={setSearchKeyword}
          className="rounded-none focus:border-positive-400"
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 100)}
        />
        {isOpen && (
          <DamulInfiniteScrollList
            queryKey={["users", debouncedSearchKeyword]}
            fetchFn={fetchUsers}
            renderItems={(item: UserSearchResult) => (
              <div
                key={item.userId}
                className="flex items-center gap-5 px-5 py-1 bg-white hover:bg-normal-50"
                onClick={() => nav(`/profile/${item.userId}/info`)}
              >
                <img
                  src={item.profileImageUrl || defaultProfile}
                  className="w-8 h-8 object-cover rounded-full border border-normal-100"
                />
                <p className="text-sm">{item.nickname}</p>
              </div>
            )}
            className="flex flex-col gap-1 absolute top-full bg-white w-full h-36 max-h-32 overflow-y-auto shadow-md"
          />
        )}
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
