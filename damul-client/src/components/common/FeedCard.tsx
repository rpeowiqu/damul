import { useLocation, useNavigate } from "react-router-dom";
import Image from "./Image";
import { formatDate } from "@/utils/date";
import BookMarkIcon from "../svg/BookMarkIcon";

interface FeedCardProps {
  id: number;
  title: string;
  thumbnailUrl: string;
  content: string;
  createdAt: string;
  authorId: number;
  nickname: string;
  bookmarked?: boolean;
  likeCnt?: number;
  liked?: boolean;
  viewCnt?: number;
}

const FeedCard = ({
  id,
  title,
  thumbnailUrl,
  content,
  createdAt,
  nickname,
  bookmarked,
  likeCnt,
  liked,
  viewCnt,
}: FeedCardProps) => {
  const location = useLocation();
  const { pathname } = location;

  const navigate = useNavigate();

  const pathTo = (id: number) => {
    if (pathname.startsWith("/community/recipe")) {
      navigate(`/community/recipe/${id}`);
    } else {
      navigate(`/community/market/${id}`);
    }
  };

  return (
    <div
      className="flex relative h-24 my-3 border border-normal-100 rounded-lg hover:border-positive-300 cursor-pointer"
      onClick={() => {
        pathTo(id);
      }}
    >
      <Image
        src={thumbnailUrl}
        alt="썸네일 이미지"
        className="rounded-s-lg w-32 h-24"
      />
      <div className="absolute left-1 top-1">
        {bookmarked ? (
          <BookMarkIcon className="w-4 h-4 fill-positive-300 stroke-positive-300" />
        ) : (
          <BookMarkIcon className="w-4 h-4 fill-white stroke-positive-300" />
        )}
      </div>
      <div className="flex flex-col justify-between flex-1 p-2">
        <div className="text-left">
          <div className="flex justify-between">
            <h3 className="font-bold line-clamp-1 w-full">{title}</h3>
          </div>
          <p className="text-xs pc:text-sm line-clamp-1">{content}</p>
        </div>
        <div className="flex justify-between pt-2 text-xxs pc:text-xs text-normal-500">
          <div className="flex flex-col text-start text-xxs">
            <span>
              조회수 {viewCnt?.toLocaleString()} | 추천{" "}
              {likeCnt?.toLocaleString()}
            </span>
            <span>{formatDate(createdAt)}</span>
          </div>
          <span className="self-end">{nickname}</span>
        </div>
      </div>
    </div>
  );
};

export default FeedCard;
