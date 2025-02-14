import { useNavigate, useSearchParams } from "react-router-dom";
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
import RecipeFeedCard from "@/components/common/RecipeFeedCard";
import { RecipeItem } from "@/types/community";

const CommunityRecipeMainPage = () => {
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

  const fetchItems = async (pageParam: number) => {
    try {
      const response = await getRecipes({
        cursor: pageParam,
        size: 5,
        orderBy: orderType,
      });
      console.log(response?.data);
      return response?.data;
    } catch (error) {
      console.log(error);
    }
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
      <PostButton to="/community/recipe/post" icon={<WriteIcon />} />
    </div>
  );
};

export default CommunityRecipeMainPage;
