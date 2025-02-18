import CommunicationIcon from "../svg/CommunicationIcon";
import PartnerIcon from "../svg/PartnerIcon";
import RecipeIcon from "../svg/RecipeIcon";
import IntroItem from "./IntroItem";
import introCommunityImage from "@/assets/intro_community.png";

const CommunityIntroItem = () => {
  return (
    <IntroItem
      title={"자유로운 소통 공간"}
      content={"식자재 관리 누구랑 해? 다믈랭에 담을랭"}
      screenImage={introCommunityImage}
      firstEffectClassName={
        "top-12 sm:top-16 right-4 sm:right-8 w-20 sm:w-24 h-20 sm:h-24 bg-violet-400"
      }
      firstEffectContent={
        <>
          <RecipeIcon className="size-10 sm:size-12 fill-white stroke-white" />
          <p className="text-white text-xxs sm:text-xs font-black text-center select-none">
            레시피 공유
          </p>
        </>
      }
      secondEffectClassName={
        "top-36 sm:top-40 left-2 sm:left-5 w-20 sm:w-24 h-20 sm:h-24 bg-green-400"
      }
      secondEffectContent={
        <>
          <PartnerIcon className="size-10 sm:size-12 fill-white stroke-white" />
          <p className="text-white text-xxs sm:text-xs font-black text-center select-none">
            식자재
            <br />
            나눔/공구
          </p>
        </>
      }
      thirdEffectClassName={
        "bottom-20 sm:bottom-24 right-6 sm:right-12 w-20 sm:w-22 h-20 sm:h-22 bg-orange-400"
      }
      thirdEffectContent={
        <>
          <CommunicationIcon className="size-10 sm:size-12 fill-white stroke-white" />
          <p className="text-white text-xxs sm:text-xs font-black text-center select-none">
            실시간 채팅
          </p>
        </>
      }
    />
  );
};

export default CommunityIntroItem;
