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

const CommunitySearchResultPage = () => {
  const navigate = useNavigate();
  const { keyword } = useParams<{ keyword: string }>();
  const location = useLocation();

  // 현재 URL에서 마지막 `/` 이후의 부분을 제거하여 base path 생성
  const basePath = location.pathname.replace(/\/[^/]+$/, "");

  const [sortType, setSortType] = useState("latest");

  return (
    <main className="h-full px-4 py-6 pc:px-6 space-y-2">
      <div className="flex-grow">
        <DamulSearchBox
          placeholder={keyword}
          onInputClick={() => navigate(basePath)}
          className="cursor-pointer"
        />
      </div>
      <div className="flex justify-end">
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
                    좋아요 많은순
                  </SelectItem>
                  <SelectItem
                    className="data-[highlighted]:bg-positive-50 data-[state=checked]:text-positive-500"
                    value="views"
                  >
                    조회수 높은순
                  </SelectItem>
                </>
              ) : (
                <>
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
                    조회수 높은순
                  </SelectItem>
                  <SelectItem
                    className="data-[highlighted]:bg-positive-50 data-[state=checked]:text-positive-500"
                    value="activated"
                  >
                    미완료만
                  </SelectItem>
                  <SelectItem
                    className="data-[highlighted]:bg-positive-50 data-[state=checked]:text-positive-500"
                    value="completed"
                  >
                    완료만
                  </SelectItem>
                </>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <FeedList />
    </main>
  );
};

export default CommunitySearchResultPage;
