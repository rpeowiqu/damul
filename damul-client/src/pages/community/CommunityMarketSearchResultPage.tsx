import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import PostFeedCard from "@/components/common/PostFeedCard";
import DamulInfiniteScrollList from "@/components/common/DamulInfiniteScrollList";
import { getPosts } from "@/service/market";
import { PostItem } from "@/types/community";
import DamulSection from "@/components/common/DamulSection";

const CommunityMarketSearchResultPage = () => {
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
      const response = await getPosts({
        cursor: pageParam,
        size: 10,
        orderBy: orderType,
        searchType: searchType,
        keyword: keyword,
      });
      if (response?.status === 204) {
        return { data: [], meta: { nextCursor: null, hasNext: false } };
      }

      return response?.data;
    } catch (error) {
      // console.log(error);
    }
  };

  return (
    <DamulSection>
      <div className="flex-grow">
        <DamulSearchBox
          placeholder={keyword}
          onInputClick={() => navigate("/community/market/search")}
          className="cursor-pointer"
        />
      </div>
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
        <Select value={orderType} onValueChange={handleSortChange}>
          <SelectTrigger className="w-28">
            <SelectValue placeholder="정렬 방식" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>정렬 조건</SelectLabel>
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
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <DamulInfiniteScrollList
        queryKey={["recipes", orderType]}
        fetchFn={fetchItems}
        renderItems={(item: PostItem) => <PostFeedCard {...item} />}
        skeleton={
          <div className="h-24 mb-2 animate-pulse bg-normal-100 rounded" />
        }
        noContent={
          <p className="text-center text-normal-200">검색 결과가 없습니다.</p>
        }
        className="flex flex-col gap-2"
      />
    </DamulSection>
  );
};

export default CommunityMarketSearchResultPage;
