import { useState, useMemo } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "@/components/common/Image";

const dummyRecipeData = [
  {
    id: 1,
    title: "한 입 먹는 순간 일본 현지인줄 알고 착각하는 돈까스",
    description: "돈까스 만드는 법",
    date: "2025-01-17",
    author: "토마토러버전종우",
  },
  {
    id: 2,
    title: "우동동 오동동",
    description: "우동 만드는 법",
    date: "2025-01-20",
    author: "토마토러버전종우",
  },
  {
    id: 3,
    title: "입에 넣으면 녹아버리는 사케동",
    description: "사케동은 어쩌구 저쩌구 저쩌구 어쩌구",
    date: "2025-01-22",
    author: "토마토러버전종우",
  },
];

const ProfileBookmarkPage = () => {
  const [sortType, setSortType] = useState("date");

  const sortedData = useMemo(() => {
    return dummyRecipeData.slice().sort((a, b) => {
      if (sortType === "date") {
        return a.date > b.date ? -1 : 1;
      } else if (sortType === "title") {
        return a.title > b.title ? 1 : -1;
      }
      return 0;
    });
  }, [sortType]);

  return (
    <div className="flex flex-col gap-2 p-5 bg-white">
      <div className="flex flex-col gap-2">
        <h1 className="text-lg font-bold">
          토마토러버전종우님이 북마크한 레시피
        </h1>
        <p className="text-normal-600">
          회원님이 관심 있어 하는 레시피들이에요.
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

      <div className="flex flex-col gap-3">
        {sortedData.map((recipe) => (
          <div
            key={recipe.id}
            className="flex h-28 border border-normal-100 rounded-lg hover:border-positive-300 cursor-pointer"
          >
            <Image className="h-full rounded-l-lg" />
            <div className="flex flex-col justify-between flex-1 p-2">
              <div>
                <p className="font-bold line-clamp-1">{recipe.title}</p>
                <p className="text-sm text-normal-600 line-clamp-2">
                  {recipe.description}
                </p>
              </div>

              <div className="flex justify-between text-sm text-normal-300">
                <p>{recipe.date}</p>
                <p>{recipe.author}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileBookmarkPage;
