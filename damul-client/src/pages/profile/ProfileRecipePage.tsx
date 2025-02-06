import { useState } from "react";
import { useOutletContext } from "react-router-dom";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FeedList from "@/components/common/FeedList";

const ProfileRecipePage = () => {
  const { user } = useOutletContext();
  const [sortType, setSortType] = useState("date");

  return (
    <div className="flex flex-col gap-2 p-5 bg-white">
      <div className="flex flex-col gap-2">
        <h1 className="text-lg font-bold">{user.nickname}님이 작성한 레시피</h1>
        <p className="text-normal-600">
          회원님이 직접 만들고 공유한 레시피들이에요.
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
      <FeedList type="profile/recipe" />
    </div>
  );
};

export default ProfileRecipePage;
