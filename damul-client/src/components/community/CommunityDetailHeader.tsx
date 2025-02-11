import { useState, useEffect } from "react";
import BookMarkIcon from "../svg/BookMarkIcon";
import { postRecipeBookMark } from "@/service/recipe";
import { formatDate } from "@/utils/date";
import { putPostStatusChange } from "@/service/market";

interface RecipeHeaderProps {
  title: string;
  createdAt: string;
  type: string;
  status?: string;
  bookmarked?: boolean;
  id?: string;
}
const CommunityDetailHeader = ({
  title,
  createdAt,
  type,
  status,
  bookmarked,
  id,
}: RecipeHeaderProps) => {
  const [isBookmarked, setIsBookmarked] = useState(bookmarked);
  const [isStatusActive, setIsStatusActive] = useState(status);

  useEffect(() => {
    setIsBookmarked(bookmarked);
  }, [bookmarked]);

  const bookmarkRecipe = async () => {
    try {
      const response = await postRecipeBookMark({ recipeId: id });
      console.log(response?.data);
      if (response?.data) {
        setIsBookmarked(true);
      } else {
        setIsBookmarked(false);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const changeStatus = async () => {
    try {
      const response = await putPostStatusChange({ postId: id });
      console.log(response?.data);
      setIsStatusActive("COMPLETED");
    } catch (error) {
      console.error(error);
    }
  };

  const StatusMarker = () =>
    status === "COMPLETED" ? (
      <div className="flex content-center bg-positive-200 text-xs py-0.5 px-2 rounded-full">
        모집중
      </div>
    ) : "1" === "1" ? (
      <div
        className="flex content-center bg-negative-200 text-xs py-0.5 px-2 rounded-full cursor-pointer"
        onClick={changeStatus}
      >
        모집 완료하기
      </div>
    ) : (
      <div className="flex content-center bg-neutral-300 text-xs py-0.5 px-2 rounded-full">
        모집완료
      </div>
    );

  return (
    <div className="flex justify-between p-2 border-b border-neutral-300">
      <div className="text-start">
        {type === "recipe" ? (
          <p className="text-sm text-neutral-600">레시피 게시판</p>
        ) : (
          <p className="text-sm text-neutral-600">공구/나눔 게시판</p>
        )}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      {type === "recipe" ? (
        <div
          onClick={bookmarkRecipe}
          className="flex flex-col w-1/3 justify-between items-end py-0.5 cursor-pointer"
        >
          {isBookmarked ? (
            <BookMarkIcon className="w-5 h-5 fill-positive-300 stroke-positive-300" />
          ) : (
            <BookMarkIcon className="w-5 h-5 stroke-positive-300" />
          )}
          {createdAt && (
            <p className="text-xs text-neutral-500">{formatDate(createdAt)}</p>
          )}
        </div>
      ) : (
        <div className="flex flex-col justify-between items-end">
          <StatusMarker />
          <p className="text-xs text-neutral-500">
            {createdAt.split("T")[0] + " " + createdAt.split("T")[1]}
          </p>
        </div>
      )}
    </div>
  );
};

export default CommunityDetailHeader;
