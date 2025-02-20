import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import RecipeFeedCard from "@/components/common/RecipeFeedCard";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getMyRecipes } from "@/service/profile";
import DamulInfiniteScrollList from "@/components/common/DamulInfiniteScrollList";

interface RecipeItem {
  id: number;
  title: string;
  thumbnailUrl: string;
  content: string;
  createdAt: string;
  authorId: number;
  nickname: string;
  bookmarked: boolean;
  likeCnt: number;
  liked: boolean;
  viewCnt: number;
}

const ProfileRecipePage = () => {
  const { user } = useOutletContext();
  const [sortType, setSortType] = useState<
    "created_at" | "like_cnt" | "view_cnt"
  >("created_at");

  const fetchRecipes = async (pageParam: number) => {
    try {
      const response = await getMyRecipes(parseInt(user.userId), {
        cursor: pageParam,
        size: 10,
        sortType,
      });
      console.log(response.data);
      if (response?.status === 204) {
        return { data: [], meta: { nextCursor: null, hasNext: false } };
      }

      return response?.data;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-2 p-5 bg-white">
      <div className="flex flex-col gap-2">
        <h1 className="text-lg font-bold">{user.nickname}님이 작성한 레시피</h1>
        <p className="text-normal-600">
          회원님이 직접 만들고 공유한 레시피들이에요.
        </p>
      </div>

      <div className="flex justify-end">
        <Select
          value={sortType}
          onValueChange={(value: "created_at" | "like_cnt" | "view_cnt") =>
            setSortType(value)
          }
        >
          <SelectTrigger className="w-28">
            <SelectValue placeholder="정렬 방식" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>정렬 방식</SelectLabel>
              <SelectItem
                className="data-[highlighted]:bg-positive-50 data-[state=checked]:text-positive-500"
                value="created_at"
              >
                최신순
              </SelectItem>
              <SelectItem
                className="data-[highlighted]:bg-positive-50 data-[state=checked]:text-positive-500"
                value="like_cnt"
              >
                추천순
              </SelectItem>
              <SelectItem
                className="data-[highlighted]:bg-positive-50 data-[state=checked]:text-positive-500"
                value="view_cnt"
              >
                조회수순
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <DamulInfiniteScrollList
        queryKey={["myRecipes", sortType]}
        fetchFn={fetchRecipes}
        renderItems={(item: RecipeItem) => (
          <RecipeFeedCard key={item.id} {...item} />
        )}
        noContent={
          <p className="text-center text-normal-200">
            작성한 레시피가 없습니다.
            <br />
            자신만의 노하우가 담긴 레시피를 작성하고 공유해보세요!
          </p>
        }
      />
    </div>
  );
};

export default ProfileRecipePage;
