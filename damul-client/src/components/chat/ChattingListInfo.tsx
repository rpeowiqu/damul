import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChattingListInfoProps {
  chattingCnt: number;
}

const ChattingListInfo = ({ chattingCnt }: ChattingListInfoProps) => {
  const [sortType, setSortType] = useState("all");

  return (
    <div className="flex justify-between">
      <div className="flex items-center text-sm">채팅 ({chattingCnt}개)</div>
      <div>
        <Select value={sortType} onValueChange={(value) => setSortType(value)}>
          <SelectTrigger className="w-40 h-8 text-xs pc:text-sm">
            <SelectValue placeholder="채팅 보기" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel className="text-xs pc:text-sm">
                채팅 보기
              </SelectLabel>
              <SelectItem
                className="data-[highlighted]:bg-positive-50 data-[state=checked]:text-positive-500 text-xs pc:text-sm"
                value="all"
              >
                전체 채팅
              </SelectItem>
              <SelectItem
                className="data-[highlighted]:bg-positive-50 data-[state=checked]:text-positive-500 text-xs pc:text-sm"
                value="normal"
              >
                일반 채팅 보기
              </SelectItem>
              <SelectItem
                className="data-[highlighted]:bg-positive-50 data-[state=checked]:text-positive-500 text-xs pc:text-sm"
                value="market"
              >
                공동구매/나눔 채팅 보기
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ChattingListInfo;
