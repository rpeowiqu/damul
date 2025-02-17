import { useState } from "react";
import { Navigate, useOutletContext } from "react-router-dom";
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
import useAuth from "@/hooks/useAuth";

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
  const { data, isLoading } = useAuth();
  const [sortType, setSortType] = useState<
    "created_at" | "like_cnt" | "view_cnt"
  >("created_at");

  const fetchBookmarks = async (pageParam: number) => {
    try {
      const response = await getBookmarks(parseInt(user.userId), {
        cursor: pageParam,
        size: 5,
        sortType,
      });
      if (response?.status === 204) {
        return { data: [], meta: { nextCursor: null, hasNext: false } };
      }

      return response?.data;
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return null;
  }

  // URL 입력으로 다른 유저의 북마크 탭으로 이동하는 경우
  if (data?.data.id !== user.userId) {
    return <Navigate to={"/404"} />;
  }

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
        queryKey={["bookMarks", sortType]}
        fetchFn={fetchBookmarks}
        renderItems={(item: RecipeItem) => (
          <RecipeFeedCard key={item.id} {...item} />
        )}
        noContent={
          <p className="text-center text-normal-200">
            등록한 북마크가 없습니다.
            <br />
            커뮤니티에서 맘에 드는 레시피를 살펴보고 등록해 보세요.
          </p>
        }
      />
    </div>
  );
};

export default ProfileBookmarkPage;
