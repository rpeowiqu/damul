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
import { getBookmarks } from "@/service/profile";
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

const ProfileBookmarkPage = () => {
  const { user } = useOutletContext();
  const [sortType, setSortType] = useState("date");

  const fetchBookmarks = async (pageParam: number) => {
    try {
      const response = await getBookmarks(parseInt(user.userId), {
        cursor: pageParam,
        size: 5,
      });
      if (response?.status === 204) {
        return { data: [], meta: { nextCursor: null, hasNext: false } };
      }

      console.log(response?.data);
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-2 p-5 bg-white">
      <div className="flex flex-col gap-2">
        <h1 className="text-lg font-bold">
          {user.nickname}님이 북마크한 레시피
        </h1>
        <p className="text-normal-600">
          회원님이 관심있어 하는 레시피들이에요.
        </p>
      </div>

      <div className="flex justify-end">
        <Select value={sortType} onValueChange={(value) => setSortType(value)}>
          <SelectTrigger className="w-28">
            <SelectValue placeholder="정렬 방식" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>정렬 방식</SelectLabel>
              <SelectItem
                className="data-[highlighted]:bg-positive-50 data-[state=checked]:text-positive-500"
                value="date"
              >
                최신순
              </SelectItem>
              <SelectItem
                className="data-[highlighted]:bg-positive-50 data-[state=checked]:text-positive-500"
                value="title"
              >
                제목순
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <DamulInfiniteScrollList
        queryKey={["bookMarks"]}
        fetchFn={fetchBookmarks}
        renderItems={(item: RecipeItem) => (
          <RecipeFeedCard key={item.id} {...item} />
        )}
      />
    </div>
  );
};

export default ProfileBookmarkPage;
