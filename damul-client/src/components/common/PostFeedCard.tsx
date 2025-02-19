import { useNavigate } from "react-router-dom";
import Image from "./Image";
import { getTimeAgo } from "@/utils/date";
import ViewIcon from "../svg/ViewIcon";

interface PostFeedCardProps {
  id: number;
  title: string;
  thumbnailUrl: string;
  content: string;
  createdAt: string;
  authorId: number;
  authorName: string;
  viewCnt: number;
  status: string;
}

const PostFeedCard = ({
  id,
  title,
  thumbnailUrl,
  content,
  createdAt,
  authorName,
  viewCnt,
  status,
}: PostFeedCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      className="flex relative h-24 my-3 border border-neutral-200 rounded-lg hover:border-positive-300 cursor-pointer"
      onClick={() => {
        navigate(`/community/market/${id}`);
      }}
    >
      <Image
        src={thumbnailUrl}
        alt="썸네일 이미지"
        className="rounded-s-lg w-32 h-full object-cover border-r-1 border-neutral-200"
      />
      <div className="absolute left-1 top-1 text-xs text-white">
        {status === "ACTIVE" ? (
          <div className="bg-positive-300 rounded-full px-2">진행중</div>
        ) : (
          <div className="bg-neutral-300 rounded-full px-2">완료</div>
        )}
      </div>
      <div className="flex flex-col justify-between flex-1 p-2">
        <div className="text-left">
          <div className="flex justify-between">
            <h3 className="text-sm font-bold line-clamp-1 w-full whitespace-pre-wrap break-words break-all">
              {title}
            </h3>
          </div>
          <p className="text-xs pc:text-sm line-clamp-1 whitespace-pre-wrap break-words break-all">
            {content}
          </p>
        </div>
        <div className="flex justify-between pt-2 text-xxs pc:text-xs text-normal-500">
          <div className="flex items-center gap-1">
            <span className="flex items-center gap-0.5">
              <ViewIcon className="w-3 h-3 stroke-neutral-500" />
              {viewCnt?.toLocaleString()}
            </span>
            <span>| {authorName}</span>
          </div>
          <span>{getTimeAgo(createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default PostFeedCard;
