import { useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import { ko } from "date-fns/locale";
import "react-day-picker/style.css";
import AnimatedNumberText from "@/components/common/AnimatedNumberText";
import useCloseOnBack from "@/hooks/useCloseOnBack";
import DamulModal from "@/components/common/DamulModal";
import ReceiptItem from "@/components/statistics/ReceiptItem";
import ReceiptIcon from "@/components/svg/ReceiptIcon";
import BarCodeIcon from "@/components/svg/BarcodeIcon";
import AnimatedArrow from "@/components/common/AnimatedArrow";
import { ChevronUp, ChevronDown } from "lucide-react";
import clsx from "clsx";
import { getPurchaseHistories, getSmartReceipt } from "@/service/statistics";
import { useQuery } from "@tanstack/react-query";
import { DailyReceiptInfo, PurchaseHistory, Receipt } from "@/types/statistics";
import useAuth from "@/hooks/useAuth";
import useOverlayStore from "@/stores/overlayStore";

const StatisticsHistoryPage = () => {
  const { data, isLoading } = useAuth();
  const [selectedMonthDate, setSelectedMonthDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isTextAnimationEnd, setIsTextAnimationEnd] = useState<boolean>(false);
  const [receiptId, setReceiptId] = useState<number>(0);
  const { overlaySet, openOverlay } = useOverlayStore();
  const isOpenOverlay = overlaySet.has("StatisticsHistoryPage");

  useCloseOnBack("StatisticsHistoryPage");
  const {
    data: purchaseHistoryData,
    isLoading: isLoadingPurchaseHistory,
    isSuccess: isSuccessPurchaseHistory,
  } = useQuery<PurchaseHistory>({
    queryKey: [
      "purchaseHistory",
      selectedMonthDate.getFullYear(),
      selectedMonthDate.getMonth() + 1,
    ],
    queryFn: async () => {
      const response = await getPurchaseHistories(
        selectedMonthDate.getFullYear(),
        selectedMonthDate.getMonth() + 1,
      );
      return response.data;
    },
    initialData: {
      monthlyTotalAmount: 0,
      comparedPreviousMonth: 0,
      dailyReceiptInfoList: [],
    },
    initialDataUpdatedAt: 0,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
  const { data: receiptData, isLoading: isLoadingReceipt } = useQuery<Receipt>({
    queryKey: ["receipt", receiptId],
    queryFn: async () => {
      const response = await getSmartReceipt(receiptId);
      return response.data;
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 3,
    enabled: receiptId > 0,
  });
  const receiptDetailInfoRef = useRef<DailyReceiptInfo>({
    dayOfMonth: 0,
    receiptIds: [],
  });

  useEffect(() => {
    if (selectedDate.getMonth() === selectedMonthDate.getMonth()) {
      const foundIndex = purchaseHistoryData.dailyReceiptInfoList.findIndex(
        (item) => item.dayOfMonth === selectedDate.getDate(),
      );
      if (foundIndex !== -1) {
        receiptDetailInfoRef.current =
          purchaseHistoryData.dailyReceiptInfoList[foundIndex];
      }
    }
  }, [purchaseHistoryData, isSuccessPurchaseHistory]);

  const handleDayChange = (date: Date) => {
    if (
      date.getMonth() === selectedDate.getMonth() &&
      date.getDate() === selectedDate.getDate()
    ) {
      return;
    }

    const foundIndex = purchaseHistoryData.dailyReceiptInfoList.findIndex(
      (item) => item.dayOfMonth === date.getDate(),
    );
    if (foundIndex !== -1) {
      receiptDetailInfoRef.current =
        purchaseHistoryData.dailyReceiptInfoList[foundIndex];
    } else {
      receiptDetailInfoRef.current = {
        dayOfMonth: 0,
        receiptIds: [],
      };
    }

    setSelectedDate(date);
  };

  const handleMonthChange = (date: Date) => {
    setSelectedMonthDate(date);
    setIsTextAnimationEnd(false);
  };

  const getAmountSpentDiffArrow = () => {
    if (purchaseHistoryData.comparedPreviousMonth > 0) {
      return (
        <AnimatedArrow
          key={purchaseHistoryData.comparedPreviousMonth > 0 ? "up" : "down"}
          direction="up"
        >
          <ChevronUp className="size-4 -my-2.5 sm:size-5 sm:-my-3" />
        </AnimatedArrow>
      );
    } else if (purchaseHistoryData.comparedPreviousMonth < 0) {
      return (
        <AnimatedArrow
          key={purchaseHistoryData.comparedPreviousMonth > 0 ? "up" : "down"}
          direction="down"
        >
          <ChevronDown className="size-4 -my-2.5 sm:size-5 sm:-my-3" />
        </AnimatedArrow>
      );
    }

    return null;
  };

  const getAmountSpentDiffText = () => {
    return (
      <div className="flex-1 flex flex-col items-end">
        <p className="text-xs sm:text-sm text-normal-300">전월 대비</p>
        <p
          className={clsx("font-bold text-sm sm:text-base", {
            "text-negative-400": purchaseHistoryData.comparedPreviousMonth > 0,
            "text-blue-400": purchaseHistoryData.comparedPreviousMonth < 0,
          })}
        >
          {purchaseHistoryData.comparedPreviousMonth.toLocaleString()}원
        </p>
      </div>
    );
  };

  if (isLoading || isLoadingPurchaseHistory) {
    return null;
  }

  const selectedMonthDateText = selectedMonthDate.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
  });
  const selectedDateText = selectedDate.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const purchasedDays = purchaseHistoryData.dailyReceiptInfoList.map(
    (item: DailyReceiptInfo) =>
      new Date(
        selectedMonthDate.getFullYear(),
        selectedMonthDate.getMonth(),
        item.dayOfMonth,
      ),
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:gap-5 px-6 sm:px-10 py-8 bg-white">
        <div>
          <h1 className="text-lg sm:text-xl font-black">
            {data?.data.nickname}님의 구매 히스토리
          </h1>

          <div className="flex items-end pb-3 border-b border-normal-100">
            <div className="flex-1">
              <p>
                <span className="text-sm sm:text-base font-bold">
                  {selectedMonthDateText}
                </span>
                에는
              </p>
              <div className="flex items-end text-sm sm:text-base">
                <AnimatedNumberText
                  key={selectedMonthDate.getMonth()}
                  className="text-sm sm:text-base font-bold"
                  targetValue={purchaseHistoryData.monthlyTotalAmount}
                  duration={500}
                  suffix="원"
                  callback={() => setIsTextAnimationEnd(true)}
                />
                을 소비했어요!
              </div>
            </div>

            {isTextAnimationEnd && (
              <div className="flex gap-1 items-center">
                {getAmountSpentDiffArrow()}
                {getAmountSpentDiffText()}
              </div>
            )}
          </div>

          <p className="text-sm sm:text-base text-center text-positive-400 font-bold mt-4">
            식자재를 등록한 날들을 확인해 보세요!
          </p>
        </div>

        <DayPicker
          className="self-center min-h-96 shadow-md border border-normal-50 p-5 rounded-xl scale-90 sm:scale-100"
          classNames={{
            caption_label: "text-lg font-black text-positive-400",
            button_next:
              "[&>svg]:fill-positive-300 m-2 hover:[&>svg]:fill-positive-500",
            button_previous:
              "[&>svg]:fill-positive-300 m-2 hover:[&>svg]:fill-positive-500",
            weekday: "font-bold",
            day: "hover:bg-normal-50 hover:text-normal-600 rounded-full",
          }}
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          locale={ko}
          onNextClick={(date) => handleMonthChange(date)}
          onPrevClick={(date) => handleMonthChange(date)}
          onDayClick={(date) => handleDayChange(date)}
          modifiers={{ purchasedDays }}
          modifiersClassNames={{
            purchasedDays: "text-positive-500 bg-positive-50",
            selected: "!bg-positive-300 text-white rounded-full",
            today: "font-black",
          }}
          required
        />
      </div>

      <div className="flex flex-col gap-3 px-6 sm:px-10 py-8 bg-white">
        <h1 className="text-lg sm:text-xl font-black text-normal-700">
          {selectedDateText} 상세 구매 이력
        </h1>
        <div className="flex flex-col gap-3 rounded-xl border border-normal-100 p-3">
          <p className="text-sm text-end">
            총 {receiptDetailInfoRef.current.receiptIds.length}
            개의 영수증
          </p>
          {receiptDetailInfoRef.current.receiptIds.length > 0 ? (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
              {receiptDetailInfoRef.current.receiptIds.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-center items-center gap-1 py-1 bg-normal-50 hover:bg-normal-100 text-normal-400 rounded-lg cursor-pointer"
                  onClick={() => {
                    setReceiptId(item);
                    openOverlay("StatisticsHistoryPage");
                  }}
                >
                  <ReceiptIcon className="size-4 sm:size-5 fill-normal-200" />
                  <p className="text-xs sm:text-sm">영수증</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-normal-200">
              등록된 영수증이 없습니다.
            </p>
          )}
        </div>
      </div>

      {receiptId > 0 && !isLoadingReceipt && (
        <DamulModal
          isOpen={isOpenOverlay}
          onOpenChange={() => {
            if (isOpenOverlay) {
              history.back();
            }
          }}
          title={"스마트 영수증"}
          titleStyle="text-normal-500"
        >
          <div className="flex flex-col gap-4">
            <p className="text-black text-end line-clamp-1 break-all">
              매장명 : {receiptData?.storeName}
            </p>
            <div className="h-44 overflow-y-auto">
              {receiptData?.receiptDetails.map((item, index) => (
                <ReceiptItem key={index} {...item} />
              ))}
            </div>
            <p className="text-end font-black text-base">
              총 지출금액 :{" "}
              <span className="text-negative-400">
                {receiptData?.totalPrice.toLocaleString()}
              </span>
              원
            </p>
            <div>
              <div className="flex justify-center gap-1">
                <BarCodeIcon className="size-12" />
                <BarCodeIcon className="size-12" />
                <BarCodeIcon className="size-12" />
              </div>
              <p className="text-center text-black font-black text-xs -mt-2">
                DA-MUL-LANG-50DAYS
              </p>
            </div>
          </div>
        </DamulModal>
      )}
    </div>
  );
};

export default StatisticsHistoryPage;
