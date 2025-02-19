import { useNavigate } from "react-router-dom";
import Image from "./Image";
import { getTimeAgo } from "@/utils/date";
import BookMarkIcon from "../svg/BookMarkIcon";
import ViewIcon from "../svg/ViewIcon";
import LikesIcon from "../svg/LikesIcon";

interface RecipeFeedCardProps {
  id: number;
  title: string;
  thumbnailUrl: string;
  content: string;
  createdAt: string;
  authorId: number;
  nickname: string;
  bookmarked: boolean | undefined;
  likeCnt: number | undefined;
  liked: boolean | undefined;
  viewCnt: number;
}

const RecipeFeedCard = ({
  id,
  title,
  thumbnailUrl,
  content,
  createdAt,
  nickname,
  bookmarked,
  likeCnt,
  viewCnt,
}: RecipeFeedCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      className="flex relative h-24 my-3 border border-normal-200 rounded-lg hover:border-positive-300 cursor-pointer"
      onClick={() => {
        navigate(`/community/recipe/${id}`);
      }}
    >
      <Image
        src={thumbnailUrl}
        alt="썸네일 이미지"
        className="rounded-s-lg w-32 h-full object-cover border-r-1 border-neutral-200"
      />
      <div className="absolute left-0.5 top-[-3px]">
        {bookmarked && (
          <BookMarkIcon className="w-6 h-6 fill-positive-300 stroke-positive-300" />
        )}
      </div>
      <div className="flex flex-col justify-between flex-1 p-2">
        <div className="text-left">
          <div className="flex justify-between">
            <h3 className="text-sm font-bold line-clamp-1 w-full whitespace-pre-wrap break-words break-all">
              {title}
            </h3>
          </div>
          <p className="text-xs pc:text-sm line-clamp-1 text-neutral-600 whitespace-pre-wrap break-words break-all">
            {content}
          </p>
        </div>
        <div className="flex justify-between pt-2 text-xxs pc:text-xs text-normal-500">
          <div className="flex items-center gap-1">
            <span className="flex items-center gap-0.5">
              <ViewIcon className="w-3 h-3 stroke-neutral-500" />
              {viewCnt?.toLocaleString()}
            </span>
            <span className="flex items-center gap-0.5">
              <LikesIcon className="w-3 h-3 stroke-neutral-500" />
              {likeCnt?.toLocaleString()}
            </span>
            <span>| {nickname}</span>
          </div>
          <span>{getTimeAgo(createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default RecipeFeedCard;
