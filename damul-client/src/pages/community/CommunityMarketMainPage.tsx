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

interface PostItem {
  id: number;
  title: string;
  thumbnailUrl: string;
  content: string;
  createdAt: string;
  authorId: number;
  authorName: string;
  status: string;
}

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
    const response = await getPosts({
      cursor: pageParam,
      size: 5,
      orderBy: orderType,
      status: statusType,
    });
    console.log(response?.data);
    return response?.data;
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
        loadSize={5}
        renderItems={(item: PostItem) => (
          <PostFeedCard
            key={item.id}
            id={item.id}
            title={item.title}
            thumbnailUrl={item.thumbnailUrl}
            content={item.content}
            createdAt={item.createdAt}
            authorId={item.authorId}
            authorName={item.authorName}
            viewCnt={20}
            status={item.status}
          />
        )}
        skeleton={
          <div className="h-24 mb-2 animate-pulse bg-normal-100 rounded" />
        }
      />
      <PostButton to="/community/market/post" icon={<WriteIcon />} />
    </main>
  );
};

export default CommunityMarketMainPage;
