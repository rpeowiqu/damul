import { useCallback, useState } from "react";

import { DayPicker } from "react-day-picker";
import { ko } from "date-fns/locale";
import "react-day-picker/style.css";
import AnimatedNumberText from "@/components/common/AnimatedNumberText";
import useCloseOnBack from "@/hooks/useCloseOnBack";
import DamulModal from "@/components/common/DamulModal";
import ReceiptItem from "@/components/statistics/ReceiptItem";

//🛒
const eventDates = ["2025-04-08", "2025-04-09", "2025-04-11"];

const StatisticsHistoryPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [amountSpent, setAmoutSpent] = useState<number>(1005280);
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

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:gap-5 px-6 sm:px-10 py-8 bg-white">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-normal-700">
            토마토러버전종우님의 구매 히스토리
          </h1>

          <h1 className="text-sm sm:text-base text-normal-700"></h1>
          <div className="flex items-center">
            {ymDate}에는
            <AnimatedNumberText
              className="text-lg font-black text-negative-400 ml-2"
              targetValue={amountSpent}
              duration={500}
              suffix="원"
            />
            을 소비했어요.
          </div>
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
          onDayClick={(date) => {
            if (date.getMonth() + 1 === selectedDate.getMonth() + 1) {
              return;
            }
            setAmoutSpent(
              Math.floor(Math.random() * (1000000 - 10000 + 1)) + 10000,
            );
          }}
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
          <div className="grid grid-cols-5 gap-3">
            {Array.from({ length: 6 }).map((item, index) => (
              <div
                key={index}
                className="bg-normal-50 hover:bg-normal-100 text-normal-400 rounded-lg text-center cursor-pointer"
                onClick={() => setIsOpen(true)}
              >
                영수증
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
        <div className="h-44 overflow-y-auto">
          {Array.from({ length: 6 }).map((item, index) => (
            <ReceiptItem key={index} />
          ))}
        </div>
        <p className="text-end font-black mt-8 text-base">
          총 지출금액: <span className="text-negative-400">147,000</span>원
        </p>
      </DamulModal>
    </div>
  );
};

export default StatisticsHistoryPage;
