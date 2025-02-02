import Image from "../common/Image";
import AlarmIcon from "../svg/AlarmIcon";

interface AuthorInfoProps {
    profileImageUrl: string;
    authorName: string;
    viewCnt: number;
    likeCnt: number;
  }
  const AuthorInfo = ({
    profileImageUrl,
    authorName,
    viewCnt,
    likeCnt,
  }: AuthorInfoProps) => {
    return (
      <div className="flex justify-between h-20 px-2">
        <div className="flex items-center">
          <Image src={profileImageUrl} className="w-12 h-12 rounded-full" />
          <p className="p-2 text-sm">{authorName}</p>
        </div>
        <div className="flex flex-col justify-between py-2">
          <div className="flex gap-2 items-center justify-end">
            <div className="flex items-center gap-1">
              <AlarmIcon className="w-4 h-4" />
              <p className="text-sm">{viewCnt}</p>
            </div>
            <div className="flex items-center gap-1">
              <AlarmIcon className="w-4 h-4" />
              <p className="text-sm">{likeCnt}</p>
            </div>
          </div>
          <div className="flex gap-2 py-2">
            <div className="flex items-center gap-1">
              <AlarmIcon className="w-4 h-4" />
              <p className="text-sm">신고하기</p>
            </div>
            <div className="flex items-center gap-1">
              <AlarmIcon className="w-4 h-4" />
              <p className="text-sm">수정하기</p>
            </div>
            <div className="flex items-center gap-1">
              <AlarmIcon className="w-4 h-4" />
              <p className="text-sm">삭제</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

export default AuthorInfo;
