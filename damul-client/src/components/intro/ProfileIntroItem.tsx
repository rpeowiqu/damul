import MedalIcon from "../svg/MedalIcon";
import IntroItem from "./IntroItem";
import introProfileImage from "@/assets/intro_profile.png";
import ViewIcon from "../svg/ViewIcon";
import MemberIcon from "../svg/MemberIcon";

const ProfileIntroItem = () => {
  return (
    <IntroItem
      title={"성취감과 함께 프로필 꾸미기"}
      content={"식자재 관리 즐겁게 해! 다믈랭에 담을랭"}
      screenImage={introProfileImage}
      firstEffectClassName={
        "bottom-20 sm:bottom-24 left-8 sm:left-16 w-20 sm:w-22 h-20 sm:h-22 bg-teal-400"
      }
      firstEffectContent={
        <>
          <MemberIcon className="size-8 sm:size-10 fill-white stroke-white" />
          <p className="text-white text-xxs sm:text-xs font-black text-center select-none">
            팔로우 시스템
          </p>
        </>
      }
      secondEffectClassName={
        "top-32 sm:top-36 right-6 sm:right-10 w-16 sm:w-20 h-16 sm:h-20 bg-pink-400"
      }
      secondEffectContent={
        <>
          <ViewIcon className="size-8 sm:size-10 stroke-white" />
          <p className="text-white text-xxs sm:text-xs font-black text-center select-none">
            식자재 보기
          </p>
        </>
      }
      thirdEffectClassName={
        "top-5 sm:top-10 left-6 sm:left-8 w-20 sm:w-24 h-20 sm:h-24 bg-indigo-400"
      }
      thirdEffectContent={
        <>
          <MedalIcon className="size-10 sm:size-12 fill-white stroke-white bg-" />
          <p className="text-white text-xxs sm:text-xs font-black text-center select-none">
            뱃지 시스템
          </p>
        </>
      }
    />
  );
};

export default ProfileIntroItem;
