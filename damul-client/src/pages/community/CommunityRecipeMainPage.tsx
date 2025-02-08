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

// 게시글 타입 정의
interface PostList {
  id: number;
  title: string;
  thumbnailUrl: string;
  content: string;
  createdAt: string;
  authorId: number;
  authorname: string;
}

const CommunityRecipeMainPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const orderBy = searchParams.get("orderBy") || "latest";

  const [posts, setPosts] = useState<PostList[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [hasNext, setHasNext] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipes = async (orderBy: string, cursor?: string) => {
    try {
      const response = await getRecipes({
        orderBy,
        cursor,
      });

      if (response) {
        // response가 null이 아닌지 확인
        setPosts((prev) =>
          cursor ? [...prev, ...response.data.data] : response.data.data,
        );
        setNextCursor(response.data.meta?.nextCursor ?? null);
        setHasNext(response.data.meta?.hasNext ?? false);
        setError(null);
      }
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
      setError("레시피를 불러오는 중 오류가 발생했습니다.");
    }
  };

  const handleSortChange = (value: string) => {
    setSearchParams({ orderBy: value });
    setNextCursor(null);
    setHasNext(false);
  };

  useEffect(() => {
    if (!searchParams.get("orderBy")) {
      setSearchParams({ orderBy: "latest" });
    } else {
      fetchRecipes(orderBy);
    }
  }, [orderBy]);

  return (
    <main className="h-full text-center px-4 py-6 pc:px-6 space-y-2">
      <DamulSearchBox
        placeholder="찾고 싶은 레시피를 검색해보세요."
        onInputClick={() => navigate("/community/recipe/search")}
        className="cursor-pointer"
      />
      <div className="flex justify-end">
        <Select value={orderBy} onValueChange={handleSortChange}>
          <SelectTrigger className="w-28">
            <SelectValue placeholder="정렬 방식" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>정렬 조건</SelectLabel>
              <SelectItem value="latest">최신순</SelectItem>
              <SelectItem value="likes">좋아요순</SelectItem>
              <SelectItem value="views">조회수순</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <FeedList type="community/recipe" />
      <PostButton to="/community/recipe/post" icon={<WriteIcon />} />
    </main>
  );
};

export default CommunityRecipeMainPage;
