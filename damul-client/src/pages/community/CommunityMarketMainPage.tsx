import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import DamulSearchBox from "@/components/common/DamulSearchBox";
import DamulInfiniteScrollList from "@/components/common/DamulInfiniteScrollList";
import PostFeedCard from "@/components/common/PostFeedCard";
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
import WriteIcon from "@/components/svg/WriteIcon";
import { getPosts } from "@/service/market";
import { PostItem } from "@/types/community";

const CommunityMarketMainPage = () => {
  const [filterActive, setFlterActive] = useState(false);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

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

  const statusType = searchParams.get("status") || "";

  const handleFilterChange = () => {
    setFlterActive(!filterActive);
    const newParams = new URLSearchParams(searchParams);
    if (!filterActive) {
      newParams.set("status", "active");
    } else {
      newParams.delete("status");
    }
    setSearchParams(newParams);
  };

  const fetchItems = async (pageParam: number) => {
    try {
      const response = await getPosts({
        cursor: pageParam,
        size: 10,
        orderBy: orderType,
        status: statusType,
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
            onCheckedChange={handleFilterChange}
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
      <DamulInfiniteScrollList
        queryKey={["posts", orderType, statusType]}
        fetchFn={fetchItems}
        renderItems={(item: PostItem) => <PostFeedCard {...item} />}
        skeleton={
          <div className="h-24 mb-2 animate-pulse bg-normal-100 rounded" />
        }
        noContent={
          <p className="text-center text-normal-200">
            등록된 레시피가 없습니다.
            <br />
            자신만의 노하우가 담긴 레시피를 작성하고 공유해보세요!
          </p>
        }
      />
      <PostButton to="/community/market/post" icon={<WriteIcon />} />
    </main>
  );
};

export default CommunityMarketMainPage;
