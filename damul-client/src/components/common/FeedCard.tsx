import { useLocation, useNavigate } from "react-router-dom";
import Image from "./Image";

interface FeedCardProps {
  id: number;
  title: string;
  thumbnailUrl: string;
  content: string;
  createdAt: string;
  authorId: number;
  authorname: string;
}

const FeedCard = ({
  id,
  title,
  thumbnailUrl,
  content,
  createdAt,
  authorId,
  authorname
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
      className="flex h-28 border border-normal-100 rounded-lg hover:border-positive-300 cursor-pointer"
      onClick={() => {
        pathTo(id);
      }}
    >
      <Image src={thumbnailUrl} alt="썸네일 이미지" className="rounded-s-lg" />
      <div className="flex flex-col justify-between flex-1 p-2">
        <div className="text-left">
          <h3 className="font-bold line-clamp-1">{title}</h3>
          <p className="text-xs pc:text-sm line-clamp-2">{content}</p>
        </div>
        <div className="flex justify-between pt-2 text-xxs pc:text-xs text-normal-500">
          <span>{createdAt}</span>
          <span>{authorname}</span>
        </div>
      </div>
    </div>
  );
};

export default FeedCard;
