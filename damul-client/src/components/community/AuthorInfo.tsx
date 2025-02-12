import { useNavigate } from "react-router-dom";
import Image from "../common/Image";
import ViewIcon from "../svg/ViewIcon";
import LikesIcon from "../svg/LikesIcon";
import ReportIcon from "../svg/ReportIcon";
import WriteIcon from "../svg/WriteIcon";
import DeleteIcon from "../svg/DeleteIcon";
import ReportButton from "../common/ReportButton";
import { postRecipeLike } from "@/service/recipe";
import { useState, useEffect } from "react";
import { deleteRecipe } from "@/service/recipe";
import { deletePost } from "@/service/market";

interface AuthorInfoProps {
  profileImageUrl: string;
  authorName: string;
  viewCnt?: number;
  likeCnt?: number;
  liked?: boolean;
  type: string;
  id: string;
}

const AuthorInfo = ({
  profileImageUrl,
  authorName,
  viewCnt,
  likeCnt = 0,
  liked,
  type,
  id,
}: AuthorInfoProps) => {
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

  return (
    <div className="flex flex-col h-auto p-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Image src={profileImageUrl} className="w-10 h-10 rounded-full" />
          <p className="p-2 text-sm">{authorName}</p>
        </div>
        <div className="flex flex-col justify-between">
          <div className="flex gap-2 items-center justify-end">
            <div className="flex items-center gap-1">
              <ViewIcon className="w-4 h-4 stroke-neutral-700" />
              <p className="text-xs text-neutral-700">
                {viewCnt?.toLocaleString()}
              </p>
            </div>
            {type === "recipe" && (
              <div
                onClick={likeRecipe}
                className="flex items-center w-12 gap-1 cursor-pointer"
              >
                {isLiked ? (
                  <LikesIcon className="w-5 h-5 fill-positive-300 stroke-neutral-500" />
                ) : (
                  <LikesIcon className="w-5 h-5 stroke-neutral-700" />
                )}
                <p className="text-xs text-neutral-700">
                  {likesCount?.toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <div className="flex items-center gap-0.5 cursor-pointer mr-2">
          <ReportButton className="flex items-center gap-0.5 cursor-pointer">
            <ReportIcon className="w-3 h-3 pc:w-4 pc:h-4 pb-0.5" />
            <p className="text-xs pc:text-sm">신고하기</p>
          </ReportButton>
        </div>
        <div
          className="flex items-center gap-0.5 cursor-pointer mr-1"
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
      </div>
    </div>
  );
};

export default AuthorInfo;
