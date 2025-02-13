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

//🛒
const eventDates = ["2025-02-08", "2025-02-09", "2025-02-11"];

const StatisticsHistoryPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [amountSpent, setAmoutSpent] = useState<number>(1000000);
  const prevAmoutSpent = useRef<number>(-1);
  const [isTextAnimationEnd, setIsTextAnimationEnd] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useCloseOnBack();

  const ymDate = selectedDate.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
  });
  const ymdDate = selectedDate.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const eventDays = eventDates.map((dateStr) => new Date(dateStr));

  useEffect(() => {
    console.log(prevAmoutSpent.current, amountSpent);
    prevAmoutSpent.current = amountSpent;
  }, [amountSpent]);

  const handleDayChange = (date: Date) => {
    if (date.getMonth() === selectedDate.getMonth()) {
      return;
    }
    setIsTextAnimationEnd(false);
    setAmoutSpent(Math.floor(Math.random() * (1000000 - 10000 + 1)) + 10000);
  };

  console.log(amountSpent - prevAmoutSpent.current);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:gap-5 px-6 sm:px-10 py-8 bg-white">
        <div>
          <h1 className="text-lg sm:text-xl font-black">
            토마토러버전종우님의 구매 히스토리
          </h1>

          <div className="flex items-end pb-3 border-b border-normal-100">
            <div className="flex-1">
              <p>
                <span className="text-sm sm:text-base font-bold">{ymDate}</span>
                에는
              </p>
              <div className="flex items-end text-sm sm:text-base">
                <AnimatedNumberText
                  className="text-sm sm:text-base font-bold"
                  targetValue={amountSpent}
                  duration={500}
                  suffix="원"
                  callback={() => setIsTextAnimationEnd(true)}
                />
                을 소비했어요!
              </div>
            </div>

            {isTextAnimationEnd && (
              <div className="flex gap-2 items-center">
                <AnimatedArrow className="shrink-0 h-full" direction="down">
                  {amountSpent - prevAmoutSpent.current > 0 ? (
                    <ChevronUp size={24} />
                  ) : (
                    <ChevronDown size={24} />
                  )}
                </AnimatedArrow>
                <div className="flex-1 flex flex-col items-end">
                  <p className="text-xs sm:text-sm text-normal-300">
                    전월 대비
                  </p>
                  <p
                    className={`font-bold text-sm sm:text-base ${amountSpent - prevAmoutSpent.current > 0 ? "text-negative-400" : "text-blue-400"}`}
                  >
                    150,000원
                  </p>
                </div>
              </div>
            )}
          </div>

          <p className="text-center mt-4">
            식자재를 등록한 날들을 확인해 보세요!
          </p>
        </div>

        <DayPicker
          className="self-center min-h-96 shadow-md border border-normal-100 p-5 rounded-xl scale-90 sm:scale-100"
          classNames={{
            caption_label: "text-lg font-black text-positive-400",
            button_next:
              "[&>svg]:fill-positive-300 m-2 hover:[&>svg]:fill-positive-500",
            button_previous:
              "[&>svg]:fill-positive-300 m-2 hover:[&>svg]:fill-positive-500",
            today: "font-black",
            weekday: "font-bold",
            day: "hover:bg-normal-50 hover:text-normal-600 rounded-full",
            selected: "bg-positive-300 text-white rounded-full",
          }}
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          locale={ko}
          onDayClick={(date) => handleDayChange(date)}
          modifiers={{
            event: eventDays,
          }}
          modifiersClassNames={{
            event: "text-positive-500 font-bold bg-positive-50",
          }}
          required
        />
      </div>

      <div className="flex flex-col gap-3 px-6 sm:px-10 py-8 bg-white">
        <h1 className="text-lg sm:text-xl font-black text-normal-700">
          {ymdDate} 상세 구매 이력
        </h1>
        <div className="flex flex-col gap-3 rounded-xl border border-normal-100 p-3">
          <p className="text-sm text-end">총 6개의 영수증</p>
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="flex justify-center items-center gap-1 py-1 bg-normal-50 hover:bg-normal-100 text-normal-400 rounded-lg cursor-pointer"
                onClick={() => setIsOpen(true)}
              >
                <ReceiptIcon className="size-4 sm:size-5 fill-normal-200" />
                <p className="text-xs sm:text-sm">영수증</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DamulModal
        isOpen={isOpen}
        onOpenChange={() => setIsOpen(!isOpen)}
        title={"🛒 스마트 영수증"}
        titleStyle="text-normal-500"
      >
        <div className="flex flex-col gap-4">
          <p className="text-black text-end line-clamp-1 break-all">
            매장명: 이마트 역삼역점
          </p>
          <div className="h-44 overflow-y-auto">
            {Array.from({ length: 6 }).map((_, index) => (
              <ReceiptItem key={index} />
            ))}
          </div>
          <p className="text-end font-black text-base">
            총 지출금액 : <span className="text-negative-400">147,000</span>원
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
    </div>
  );
};

export default StatisticsHistoryPage;
