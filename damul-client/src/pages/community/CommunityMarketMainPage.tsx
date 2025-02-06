import { useNavigate } from "react-router-dom";
import { useState } from "react";
import FeedList from "@/components/common/FeedList";
import DamulSearchBox from "@/components/common/DamulSearchBox";
import PostButton from "@/components/community/PostButton";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const CommunityMarketMainPage = () => {
  const navigate = useNavigate();
  const [sortType, setSortType] = useState("latest");
  const [filterActive, setFlterActive] = useState(false);

  return (
    <main className="h-full text-center px-4 py-6 pc:px-6 space-y-2">
      <DamulSearchBox
        placeholder="원하는 식자재를 검색해보세요."
        onInputClick={() => {
          navigate("/community/market/search");
        }}
        className="cursor-pointer"
      />
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <Switch
            id="warning"
            checked={filterActive}
            onCheckedChange={() => {
              setFlterActive(!filterActive);
            }}
            className="data-[state=checked]:bg-positive-200"
          />
          <p
            className={`text-sm ${filterActive ? "text-positive-400" : "text-normal-400"}`}
          >
            {filterActive ? "진행중인 공구/나눔만 보기" : "모든 공구/나눔 보기"}
          </p>
        </div>
        <Select value={sortType} onValueChange={(value) => setSortType(value)}>
          <SelectTrigger className="w-28">
            <SelectValue placeholder="정렬 방식" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>정렬 조건</SelectLabel>
              <SelectItem
                className="data-[highlighted]:bg-positive-50 data-[state=checked]:text-positive-500"
                value="latest"
              >
                최신순
              </SelectItem>
              <SelectItem
                className="data-[highlighted]:bg-positive-50 data-[state=checked]:text-positive-500"
                value="views"
              >
                조회수순
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <FeedList type="community/market" />
      <PostButton to="market" />
    </main>
  );
};

export default CommunityMarketMainPage;
