import { useNavigate } from "react-router-dom";
import Image from "../common/Image";
import AlarmIcon from "../svg/AlarmIcon";
import ViewIcon from "../svg/ViewIcon";
import LikesIcon from "../svg/LikesIcon";
import ReportIcon from "../svg/ReportIcon";
import WriteIcon from "../svg/WriteIcon";
import DeleteIcon from "../svg/DeleteIcon";

interface AuthorInfoProps {
  profileImageUrl: string;
  authorName: string;
  viewCnt?: number;
  likeCnt?: number;
  isLiked?: boolean;
  type: string;
  id: number;
}
const AuthorInfo = ({
  profileImageUrl,
  authorName,
  viewCnt,
  likeCnt,
  isLiked,
  type,
  id,
}: AuthorInfoProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between h-20 px-2">
      <div className="flex items-center">
        <Image src={profileImageUrl} className="w-12 h-12 rounded-full" />
        <p className="p-2 text-sm">{authorName}</p>
      </div>
      {type === "recipe" ? (
        <div className="flex flex-col justify-between py-2">
          <div className="flex gap-2 items-center justify-end">
            <div className="flex items-center gap-1">
              <ViewIcon className="w-4 h-4 stroke-neutral-700" />
              <p className="text-xs text-neutral-700">{viewCnt}</p>
            </div>
            <div className="flex items-center gap-1 cursor-pointer">
              {isLiked ? (
                <LikesIcon className="w-4 h-4 fill-positive-300  stroke-neutral-700" />
              ) : (
                <LikesIcon className="w-4 h-4   stroke-neutral-700" />
              )}
              <p className="text-xs text-neutral-700">{likeCnt}</p>
            </div>
          </div>
          <div className="flex gap-2 py-2 ">
            <div className="flex items-center gap-0.5 cursor-pointer">
              <ReportIcon className="w-4 h-4 pb-0.5" />
              <p className="text-sm">신고하기</p>
            </div>
            <div
              className="flex items-center gap-0.5 cursor-pointer"
              onClick={() => {
                navigate(`/community/${type}/${id}/edit`);
              }}
            >
              <WriteIcon className="w-4 h-4 pb-0.5" />
              <p className="text-sm">수정하기</p>
            </div>
            <div className="flex items-center gap-0.5 cursor-pointer">
              <DeleteIcon className="w-4 h-4 fill-neutral-700 pb-0.5" />
              <p className="text-sm">삭제</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex gap-2 py-2 items-start mt-1">
          <div className="flex items-center gap-0.5 cursor-pointer">
            <ReportIcon className="w-4 h-4 pb-0.5" />
            <p className="text-sm">신고하기</p>
          </div>
          <div
            className="flex items-center gap-0.5 cursor-pointer"
            onClick={() => {
              navigate(`/community/${type}/${id}/edit`);
            }}
          >
            <WriteIcon className="w-4 h-4 pb-0.5" />
            <p className="text-sm">수정하기</p>
          </div>
          <div className="flex items-center gap-0.5 cursor-pointer">
            <DeleteIcon className="w-4 h-4 fill-neutral-700 pb-0.5" />
            <p className="text-sm">삭제</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorInfo;
