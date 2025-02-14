import { useNavigate } from "react-router-dom";
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
  const nav = useNavigate();

  return (
    <div className="flex items-center gap-4 sm:gap-8 h-20 px-6 sm:px-8 pc:px-10 border-b border-normal-100">
      <img
        src={profileImageUrl || defaultProfile}
        className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-full border border-normal-100 cursor-pointer"
        onClick={() => nav(`/profile/${userId}/info`)}
      />
      <p
        className="flex-1 line-clamp-1 text-sm sm:text-base hover:text-normal-500 cursor-pointer"
        onClick={() => nav(`/profile/${userId}/info`)}
      >
        {nickname}
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-2">
        {children}
      </div>
    </div>
  );
};

export default FriendItem;
