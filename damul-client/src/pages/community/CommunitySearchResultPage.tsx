import { useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
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
import FeedCard from "@/components/common/RecipeFeedCard";
import DamulInfiniteScrollList from "@/components/common/DamulInfiniteScrollList";
import { getRecipes } from "@/service/recipe";

interface RecipeItem {
  id: number;
  title: string;
  thumbnailUrl: string;
  content: string;
  createdAt: string;
  authorId: number;
  nickname: string;
  bookmarked?: boolean;
  likeCnt?: number;
  liked?: boolean;
  viewCnt: number;
}

const CommunitySearchResultPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterActive, setFlterActive] = useState(false);
  const navigate = useNavigate();

  // URL에서 keyword
  const keyword = searchParams.get("keyword") || "";

  // URL에서 searchType
  const searchType = searchParams.get("searchType") || "";

  // URL의 orderBy 값이 없으면 기본값 'latest' 설정
  const orderType = searchParams.get("orderBy") || "latest";

  const handleSortChange = (value: string) => {
    // 정렬 기준 변경 시 URL 업데이트
    const newParams = new URLSearchParams(searchParams);
    if (value === "latest") {
      newParams.delete("orderBy");
    } else {
      newParams.set("orderBy", value);
    }
    setSearchParams(newParams);
  };

  const fetchItems = async (pageParam: number) => {
    try {
      const response = await getRecipes({
        cursor: pageParam,
        size: 5,
        orderBy: orderType,
        searchType: searchType,
        keyword: keyword,
      });
      return response?.data;
    } catch (error) {
      console.log(error);
    }
  };

  const location = useLocation();

  // 현재 URL에서 마지막 `/` 이후의 부분을 제거하여 base path 생성
  const basePath = location.pathname.replace(/\/[^/]+$/, "").replace(/^\//, "");

  return (
    <main className="h-full px-4 py-6 pc:px-6 space-y-2">
      <div className="flex-grow">
        <DamulSearchBox
          placeholder={keyword}
          onInputClick={() => navigate(`/${basePath}`)}
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
        <Select value={orderType} onValueChange={handleSortChange}>
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
      <DamulInfiniteScrollList
        queryKey={["recipes", orderType]}
        fetchFn={fetchItems}
        loadSize={5}
        renderItems={(item: RecipeItem) => (
          <FeedCard
            key={item.id}
            id={item.id}
            title={item.title}
            thumbnailUrl={item.thumbnailUrl}
            content={item.content}
            createdAt={item.createdAt}
            authorId={item.authorId}
            nickname={item.nickname}
            bookmarked={item.bookmarked}
            likeCnt={item.likeCnt}
            liked={item.liked}
            viewCnt={item.viewCnt}
          />
        )}
        skeleton={
          <div className="h-24 mb-2 animate-pulse bg-normal-100 rounded" />
        }
      />
    </main>
  );
};

export default CommunitySearchResultPage;
