import AlarmIcon from "../svg/AlarmIcon";
import QRScanIcon from "../svg/QRScanIcon";
import ReceiptScanIcon from "../svg/ReceiptScanIcon";
import IntroItem from "./IntroItem";
import introMainImage from "@/assets/intro_main.png";

const MainIntroItem = () => {
  return (
    <IntroItem
      title={"효율적인 식자재 관리"}
      content={"식자재 관리 어떻게 해? 다믈랭에 담을랭"}
      screenImage={introMainImage}
      firstEffectClassName={
        "top-8 sm:top-10 left-4 sm:left-8 w-20 sm:w-24 h-20 sm:h-24 bg-red-400"
      }
      firstEffectContent={
        <>
          <ReceiptScanIcon className="size-10 sm:size-12 fill-white stroke-white" />
          <p className="text-white text-xxs sm:text-xs font-black text-center">
            영수증 스캔
          </p>
        </>
      }
      secondEffectClassName={
        "top-32 sm:top-36 right-6 sm:right-10 w-16 sm:w-20 h-16 sm:h-20 bg-blue-400"
      }
      secondEffectContent={
        <>
          <QRScanIcon className="size-8 sm:size-10 fill-white stroke-white" />
          <p className="text-white text-xxs sm:text-xs font-black text-center">
            QR스캔
          </p>
        </>
      }
      thirdEffectClassName={
        "bottom-20 sm:bottom-24 left-8 sm:left-16 w-20 sm:w-22 h-20 sm:h-22 bg-yellow-400"
      }
      thirdEffectContent={
        <>
          <AlarmIcon className="size-8 sm:size-10 fill-white stroke-white" />
          <p className="text-white text-xxs sm:text-xs font-black text-center">
            소비 기한
            <br />
            임박 알림
          </p>
        </>
      }
    />
  );
};

export default MainIntroItem;
