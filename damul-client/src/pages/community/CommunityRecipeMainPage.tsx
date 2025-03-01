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
import DamulSection from "@/components/common/DamulSection";

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
        size: 10,
        orderBy: orderType,
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
    <>
      <DamulSection>
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
          renderItems={(item: RecipeItem) => (
            <RecipeFeedCard key={item.id} {...item} />
          )}
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
          className="flex flex-col gap-2"
        />
      </DamulSection>
      <PostButton
        to="/community/recipe/post"
        icon={<WriteIcon className="scale-150 fill-positive-300" />}
      />
    </>
  );
};

export default CommunityRecipeMainPage;
