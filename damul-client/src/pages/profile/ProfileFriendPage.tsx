import { Suspense, useRef, useState } from "react";
import { NavLink, Outlet, useParams } from "react-router-dom";

import DamulSearchBox from "@/components/common/DamulSearchBox";
import clsx from "clsx";
import DamulSection from "@/components/common/DamulSection";

const ProfileFriendPage = () => {
  const { userId } = useParams();
  const [searchKeyword, setSetSearchKeyword] = useState<string>("");
  const [submitSearchKeyword, setSubmitSearchKeyword] = useState<string>("");

  return (
    <DamulSection>
      <div className="flex flex-col gap-5 h-full">
        <DamulSearchBox
          inputValue={searchKeyword}
          setInputValue={setSetSearchKeyword}
          placeholder="친구 이름을 검색해 보세요."
          onButtonClick={() => setSubmitSearchKeyword(searchKeyword)}
          resetAfter={false}
        />

        <div className="flex-1">
          <div className="flex">
            <NavLink
              to={`/profile/${userId}/friend/follower`}
              className={({ isActive }) =>
                clsx(
                  "flex-1 text-center py-3 rounded-tr-lg font-bold text-normal-600",
                  isActive
                    ? "border-t border-r border-normal-100 text-positive-400"
                    : "border-b border-normal-100",
                )
              }
            >
              팔로워
            </NavLink>
            <NavLink
              to={`/profile/${userId}/friend/following`}
              className={({ isActive }) =>
                clsx(
                  "flex-1 text-center py-3 rounded-tl-lg font-bold text-normal-600",
                  isActive
                    ? "border-t border-l border-normal-100 text-positive-400"
                    : "border-b border-normal-100",
                )
              }
            >
              팔로잉
            </NavLink>
          </div>
          <Suspense fallback={<div></div>}>
            <Outlet context={{ searchKeyword: submitSearchKeyword }} />
          </Suspense>
        </div>
      </div>
    </DamulSection>
  );
};

export default ProfileFriendPage;
