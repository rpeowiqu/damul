import { useNavigate } from "react-router-dom";
import { useState } from "react";
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

const CommunityRecipeMainPage = () => {
  const navigate = useNavigate();
  const [sortType, setSortType] = useState("latest");

  return (
    <main className="h-full text-center px-4 py-6 pc:px-6 space-y-2">
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
      <FeedList type="community/recipe" />
      <PostButton to="/community/recipe/post" icon={<WriteIcon />} />
    </main>
  );
};

export default CommunityRecipeMainPage;
