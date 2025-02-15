import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import Image from "../common/Image";
import ViewIcon from "../svg/ViewIcon";
import LikesIcon from "../svg/LikesIcon";
import ReportIcon from "../svg/ReportIcon";
import WriteIcon from "../svg/WriteIcon";
import DeleteIcon from "../svg/DeleteIcon";
import ReportButton from "../common/ReportButton";
import { postRecipeLike } from "@/service/recipe";
import { deleteRecipe } from "@/service/recipe";
import { deletePost } from "@/service/market";
import useAuth from "@/hooks/useAuth";

interface AuthorInfoProps {
  profileImageUrl: string;
  authorName: string;
  authorId: number;
  viewCnt?: number;
  likeCnt?: number;
  liked?: boolean;
  type: string;
  id: string;
  isLoading?: boolean;
}

const AuthorInfo = ({
  profileImageUrl,
  authorName,
  authorId,
  viewCnt,
  likeCnt = 0,
  liked,
  type,
  id,
  isLoading,
}: AuthorInfoProps) => {
  const { data, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(liked);
  const [likesCount, setLikesCount] = useState(likeCnt);

  useEffect(() => {
    setIsLiked(liked);
    setLikesCount(likeCnt);
  }, [liked, likeCnt, id]);

  const likeRecipe = async () => {
    try {
      const response = await postRecipeLike(id);
      console.log(response?.data);
      if (response?.data) {
        setIsLiked(true);
        setLikesCount((prev) => prev + 1);
      } else {
        setIsLiked(false);
        setLikesCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const clickDeleteRecipe = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) {
      return;
    }
    try {
      const response =
        type === "recipe"
          ? await deleteRecipe({ recipeId: id })
          : await deletePost({ postId: id });

      navigate("/community/recipe");
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-auto p-2">
        <div className="flex justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <Skeleton circle width={35} height={35} />
            <Skeleton width={80} height={16} />
          </div>
          <Skeleton width={50} height={14} />
        </div>
        <div className="flex justify-end">
          <Skeleton width={150} height={14} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-auto p-2">
      <div className="flex justify-between items-center">
        <Link to={`/profile/${authorId}/info`}>
          <div className="flex items-center">
            <Image src={profileImageUrl} className="w-10 h-10 rounded-full" />
            <p className="p-2 text-sm">{authorName}</p>
          </div>
        </Link>
        <div className="flex flex-col justify-between">
          <div className="flex gap-2 items-center justify-end">
            <div className="flex items-center gap-1">
              <ViewIcon className="w-4 h-4 pc:w-5 pc:h-5 stroke-neutral-600" />
              <p className="text-xs pc:text-sm text-neutral-700">
                {viewCnt?.toLocaleString()}
              </p>
            </div>
            {type === "recipe" && (
              <div
                onClick={likeRecipe}
                className="flex items-center gap-1 cursor-pointer"
              >
                {isLiked ? (
                  <LikesIcon className="w-5 h-5 pc:w-6 pc:h-6 fill-positive-300 stroke-neutral-500" />
                ) : (
                  <LikesIcon className="w-5 h-5 pc:w-6 pc:h-6 stroke-neutral-700" />
                )}
                <p className="text-xs pc:text-sm text-neutral-700">
                  {likesCount?.toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <div className="flex items-center gap-0.5 cursor-pointer">
          <ReportButton className="flex items-center gap-0.5 cursor-pointer">
            <ReportIcon className="w-3 h-3 pc:w-4 pc:h-4 pb-0.5" />
            <p className="text-xs pc:text-sm">신고하기</p>
          </ReportButton>
        </div>
        {data?.data.id === authorId && (
          <>
            <div
              className="flex items-center gap-0.5 cursor-pointer pl-3"
              onClick={() => {
                navigate(`/community/${type}/${id}/edit`);
              }}
            >
              <WriteIcon className="w-3 h-3 pc:w-4 pc:h-4 pb-0.5" />
              <p className="text-xs pc:text-sm">수정하기</p>
            </div>
            <div
              className="flex items-center gap-0 cursor-pointer"
              onClick={clickDeleteRecipe}
            >
              <DeleteIcon className="w-5 h-5 pc:w-7 pc:h-7 fill-neutral-700 pb-0.5" />
              <p className="text-xs pc:text-sm">삭제하기</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthorInfo;
