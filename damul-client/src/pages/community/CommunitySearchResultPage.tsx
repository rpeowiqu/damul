import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import FeedList from "@/components/common/FeedList";
import DamulSearchBox from "@/components/common/DamulSearchBox";
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

const CommunitySearchResultPage = () => {
  const navigate = useNavigate();
  const { keyword } = useParams<{ keyword: string }>();
  const location = useLocation();

  // 현재 URL에서 마지막 `/` 이후의 부분을 제거하여 base path 생성
  const basePath = location.pathname.replace(/\/[^/]+$/, "").replace(/^\//, "");

  const [sortType, setSortType] = useState("latest");
  const [filterActive, setFlterActive] = useState(false);

  return (
    <main className="h-full px-4 py-6 pc:px-6 space-y-2">
      <div className="flex-grow">
        <DamulSearchBox
          placeholder={keyword}
          onInputClick={() => navigate(basePath)}
          className="cursor-pointer"
        />
      </div>
      <div className="flex justify-between">
        {basePath.endsWith("/market/search") ? (
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
              {filterActive
                ? "진행중인 공구/나눔만 보기"
                : "모든 공구/나눔 보기"}
            </p>
          </div>
        ) : (
          <div></div>
        )}
        <Select value={sortType} onValueChange={(value) => setSortType(value)}>
          <SelectTrigger className="w-28">
            <SelectValue placeholder="정렬 방식" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>정렬 조건</SelectLabel>
              {basePath.endsWith("/recipe/search") ? (
                <>
                  <SelectItem
                    className="data-[highlighted]:bg-positive-50 data-[state=checked]:text-positive-500"
                    value="latest"
                  >
                    최신순
                  </SelectItem>
                  <SelectItem
                    className="data-[highlighted]:bg-positive-50 data-[state=checked]:text-positive-500"
                    value="likes"
                  >
                    좋아요순
                  </SelectItem>
                  <SelectItem
                    className="data-[highlighted]:bg-positive-50 data-[state=checked]:text-positive-500"
                    value="views"
                  >
                    조회수순
                  </SelectItem>
                </>
              ) : (
                <div className="flex flex-col">
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
                </div>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <FeedList type={`${basePath}`} />
    </main>
  );
};

export default CommunitySearchResultPage;
