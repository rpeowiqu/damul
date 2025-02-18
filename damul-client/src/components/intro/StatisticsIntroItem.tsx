import IntroItem from "./IntroItem";
import introStatisticsImage from "@/assets/intro_statistics.png";
import GraphIcon from "../svg/GraphIcon";
import ReceiptIcon from "../svg/ReceiptIcon";

const StatisticsIntroItem = () => {
  return (
    <IntroItem
      title={"합리적인 소비와 가계 관리"}
      content={"식자재 관리 체계적으로 해! 다믈랭에 담을랭"}
      screenImage={introStatisticsImage}
      firstEffectClassName={
        "bottom-20 sm:bottom-24 left-6 sm:left-8 w-20 sm:w-24 h-20 sm:h-24 bg-gray-400"
      }
      firstEffectContent={
        <>
          <ReceiptIcon className="size-10 sm:size-12 fill-white stroke-white" />
          <p className="text-white text-xxs sm:text-xs font-black text-center select-none">
            스마트 영수증
            <br />
            캘린더
          </p>
        </>
      }
      secondEffectClassName={
        "top-16 sm:top-24 right-6 sm:right-8 w-20 sm:w-24 h-20 sm:h-24 bg-lime-400"
      }
      secondEffectContent={
        <>
          <GraphIcon className="size-10 sm:size-12 fill-white stroke-white" />
          <p className="text-white text-xxs sm:text-xs font-black text-center select-none">
            식자재
            <br />
            가격 동향
          </p>
        </>
      }
    />
  );
};

export default StatisticsIntroItem;
