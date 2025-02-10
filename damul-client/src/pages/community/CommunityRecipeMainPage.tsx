import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
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
import WriteIcon from "@/components/svg/WriteIcon";
import { getRecipes } from "@/service/recipe";
import DamulInfiniteScrollList from "@/components/common/DamulInfiniteScrollList";
import FeedCard from "@/components/common/FeedCard";

interface RecipeItem {
  data: [
    {
      id: number;
      title: string;
      thumbnailUrl: string;
      content: string;
      createdAt: string;
      authorId: number;
      authorname: string;
    },
  ];
  meta: {
    nextCursor: number;
    hasNext: boolean;
  };
}

const CommunityRecipeMainPage = () => {
  const navigate = useNavigate();
  const [sortType, setSortType] = useState("latest");
  const [searchParams, setSearchParams] = useSearchParams();

  const addSortParams = () => {
    searchParams.set("orderBy", sortType);
    setSearchParams(searchParams);
  };

  const orderBy = searchParams.get("orderBy") || "";

  useEffect(() => {
    addSortParams();
  }, [sortType]);

  const fetchItems = async (pageParam: number) => {
    const response = await getRecipes({
      cursor: pageParam,
      size: 10,
    });
    console.log(response?.data);
    return response?.data;
  };

  return (
    <div className="h-full text-center px-4 py-6 pc:px-6 space-y-2">
      <DamulSearchBox
        placeholder="찾고 싶은 레시피를 검색해보세요."
        onInputClick={() => {
          navigate("/community/recipe/search");
        }}
        className="cursor-pointer"
      />
      <div className="flex justify-end">
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
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <DamulInfiniteScrollList
        queryKey={["recipes"]}
        fetchFn={fetchItems}
        loadSize={10}
        renderItems={(item:  {
          id: number;
          title: string;
          thumbnailUrl: string;
          content: string;
          createdAt: string;
          authorId: number;
          authorname: string;
        },) => (
          <FeedCard
            key={item.id}
            id={item.id}
            title={item.title}
            thumbnailUrl={item.thumbnailUrl}
            content={item.content}
            createdAt={item.createdAt}
            authorId={item.authorId}
            authorname={item.authorname}
          />
        )}
        skeleton={
          <div className="h-24 mb-2 animate-pulse bg-normal-100 rounded" />
        }
      />
      <PostButton to="/community/recipe/post" icon={<WriteIcon />} />
    </div>
  );
};

export default CommunityRecipeMainPage;
