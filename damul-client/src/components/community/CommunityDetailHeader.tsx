import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import BookMarkIcon from "../svg/BookMarkIcon";
import { postRecipeBookMark } from "@/service/recipe";
import { formatDate } from "@/utils/date";
import { putPostStatusChange } from "@/service/market";
import useAuth from "@/hooks/useAuth";

interface RecipeHeaderProps {
  title: string;
  createdAt: string;
  type: string;
  status?: string;
  bookmarked?: boolean;
  id?: string;
  authorId?: number;
  isLoading?: boolean;
}
const CommunityDetailHeader = ({
  title,
  createdAt,
  type,
  status,
  bookmarked,
  id,
  authorId,
  isLoading,
}: RecipeHeaderProps) => {
  const [isBookmarked, setIsBookmarked] = useState(bookmarked);
  const [isStatusActive, setIsStatusActive] = useState(status);
  const { data, isLoading: authLoading } = useAuth();

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
    const isConfirmed = window.confirm("공구/나눔 모집을 완료하시겠습니까?");

    if (!isConfirmed) {
      return;
    }
    try {
      const response = await putPostStatusChange({ postId: id });
      console.log(response?.data);
      setIsStatusActive("COMPLETED");
    } catch (error) {
      console.error(error);
    }
  };

  const StatusMarker = () => {
    return status === "COMPLETED" || isStatusActive === "COMPLETED" ? (
      <div className="flex content-center bg-neutral-300 text-xs py-0.5 px-2 rounded-full">
        모집완료
      </div>
    ) : data?.data.id === authorId ? (
      <div
        className="flex content-center bg-negative-200 text-xs py-0.5 px-2 rounded-full cursor-pointer"
        onClick={changeStatus}
      >
        모집 완료하기
      </div>
    ) : (
      <div className="flex content-center bg-positive-200 text-xs py-0.5 px-2 rounded-full">
        모집중
      </div>
    );
  };

  if (isLoading || authLoading) {
    return (
      <div className="flex justify-between p-2 border-b border-neutral-300">
        <div className="text-start">
          <Skeleton width={100} height={14} />
          <Skeleton width={200} height={20} />
        </div>
        <div className="flex flex-col justify-between items-end">
          <Skeleton width={30} height={20} />
          <Skeleton width={100} height={20} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-between p-2 border-b border-neutral-300">
      <div className="text-start">
        {type === "recipe" ? (
          <Link to="/community/recipe">
            <p className="text-sm text-neutral-600">레시피 게시판</p>
          </Link>
        ) : (
          <Link to="/community/market">
            <p className="text-sm text-neutral-600">공구/나눔 게시판</p>
          </Link>
        )}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      {type === "recipe" ? (
        <div
          onClick={bookmarkRecipe}
          className="flex flex-col max-w-1/3 justify-between items-end py-0.5 cursor-pointer"
        >
          {isBookmarked ? (
            <BookMarkIcon className="w-5 h-5 fill-positive-300 stroke-positive-300" />
          ) : (
            <BookMarkIcon className="w-5 h-5 fill-white stroke-positive-300" />
          )}
          {createdAt ? (
            <p className="text-xs text-neutral-500">{formatDate(createdAt)}</p>
          ) : (
            <Skeleton width={80} height={14} />
          )}
        </div>
      ) : (
        <div className="flex flex-col justify-between items-end">
          <StatusMarker />
          <p className="text-xs text-neutral-500">
            {createdAt ? (
              createdAt.split("T")[0] + " " + createdAt.split("T")[1]
            ) : (
              <Skeleton width={100} height={14} />
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default CommunityDetailHeader;
