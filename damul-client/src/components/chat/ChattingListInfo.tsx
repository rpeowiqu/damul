import { useSearchParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ChattingListInfo = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filterType = searchParams.get("filter") || "";

  const handleSortChange = (value: string) => {
    // 정렬 기준 변경 시 URL 업데이트
    const newParams = new URLSearchParams(searchParams);
    if (value === "all") {
      newParams.delete("filter");
    } else {
      newParams.set("filter", value);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="flex justify-end">
      <div>
        <Select value={filterType} onValueChange={handleSortChange}>
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
                value="without_post"
              >
                일반 채팅
              </SelectItem>
              <SelectItem
                className="data-[highlighted]:bg-positive-50 data-[state=checked]:text-positive-500 text-xs pc:text-sm"
                value="with_post"
              >
                공동구매/나눔 채팅
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ChattingListInfo;
