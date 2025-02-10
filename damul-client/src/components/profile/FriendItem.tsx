import { Link } from "react-router-dom";
import { ReactNode } from "react";
import defaultProfile from "@/assets/profile.png";

export interface FriendItemProps {
  userId: number;
  profileImageUrl: string;
  nickname: string;
  children: ReactNode;
}

const FriendItem = ({
  userId,
  profileImageUrl,
  nickname,
  children,
}: FriendItemProps) => {
  return (
    <div className="flex items-center gap-4 sm:gap-8 h-20 px-6 sm:px-8 pc:px-10 border-b border-normal-100">
      <img
        src={profileImageUrl || defaultProfile}
        className="w-14 h-14 xs:w-16 xs:h-16 object-cover rounded-full border border-normal-100"
      />
      <Link
        to={`/profile/${userId}/info`}
        className="flex-1 line-clamp-1 text-sm xs:text-base hover:text-normal-400"
      >
        {nickname}
      </Link>
      <div className="flex flex-col sm:flex-row justify-center gap-2">
        {children}
      </div>
    </div>
  );
};

export default FriendItem;
