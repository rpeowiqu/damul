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
import RecipeFeedCard from "@/components/common/RecipeFeedCard";
import DamulInfiniteScrollList from "@/components/common/DamulInfiniteScrollList";
import { getRecipes } from "@/service/recipe";
import { RecipeItem } from "@/types/community";

const CommunityRecipeSearchResultPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
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
        size: 10,
        orderBy: orderType,
        searchType: searchType,
        keyword: keyword,
      });
      return response?.data;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="h-full px-4 py-6 pc:px-6 space-y-2">
      <div className="flex-grow">
        <DamulSearchBox
          placeholder={keyword}
          onInputClick={() => navigate("/community/recipe/search")}
          className="cursor-pointer"
        />
      </div>
      <div className="flex justify-end">
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
                value="likes"
              >
                추천순
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
        queryKey={["recipes", orderType]}
        fetchFn={fetchItems}
        renderItems={(item: RecipeItem) => <RecipeFeedCard {...item} />}
        skeleton={
          <div className="h-24 mb-2 animate-pulse bg-normal-100 rounded" />
        }
      />
    </main>
  );
};

export default CommunityRecipeSearchResultPage;
