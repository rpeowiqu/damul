import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Image from "../common/Image";
import MenuIcon from "@/components/svg/MenuIcon";
import ExitIcon from "../svg/ExitIcon";
import {
  getChattingMembers,
  deleteFromRoom,
  deleteMemberFromRoom,
} from "@/service/chatting";
import { ChattingMember } from "@/types/chatting";
import useAuth from "@/hooks/useAuth";
import DamulButton from "../common/DamulButton";

interface ChattingMenuButtonProps {
  roomId: string | undefined;
  postId: number;
}

const ChattingMenuButton = ({ roomId, postId }: ChattingMenuButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [memberData, setMemberData] = useState<ChattingMember[]>();
  const [memberCnt, setMemberCnt] = useState(0);
  const [adminId, setAdminId] = useState(0);

  const { data, isLoading } = useAuth();

  const menuRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchItems = async () => {
    try {
      const response = await getChattingMembers({
        roomId: roomId,
      });
      setMemberData(response?.data.content);
      setMemberCnt(response?.data.totalMembers);
      setAdminId(response?.data.adminId);
      return response?.data;
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleExitRoom = async () => {
    try {
      const response = await deleteFromRoom({ roomId: roomId });
      // console.log(response);
      navigate("/chatting");
    } catch (error) {
      // console.log(error);
    }
  };

  const handleRemoveMember = async (memberId: number, nickname: string) => {
    try {
      if (!confirm(`${nickname}님이 강제 퇴장됩니다.`)) {
        return;
      }
      const response = await deleteMemberFromRoom({
        roomId: roomId,
        memberId: memberId,
      });
      fetchItems();
    } catch (error) {
      // console.log(error);
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <div>
      <div ref={menuRef} className="relative">
        <div
          onClick={() => {
            setIsOpen((preState) => !preState);
          }}
        >
          <MenuIcon className="w-6 h-6 pc:w-8 pc:h-8 cursor-pointer" />
        </div>

        <div
          className={`absolute flex-col w-64 p-4 z-50 gap-3 border-1 bg-white rounded-xl shadow-md top-4 right-4 flex ${!isOpen && "hidden"}`}
        >
          <div className="font-semibold">참여자({memberCnt})</div>

          {/* 참여자 목록 */}
          {memberData?.map((member) => (
            <div key={member.id} className="flex justify-between items-center">
              <div className="flex items-center gap-3 text-sm font-normal cursor-pointer">
                <Image
                  src={member.profileImageUrl}
                  className="w-10 h-10 rounded-full"
                />
                <div>{member.nickname}</div>
              </div>
              {data?.data.id === adminId && data?.data.id !== member.id && (
                <div
                  className="text-sm font-normal text-negative-600 cursor-pointer"
                  onClick={() => handleRemoveMember(member.id, member.nickname)}
                >
                  강제 퇴장
                </div>
              )}
            </div>
          ))}
          {postId !== 0 ? (
            <div className="flex justify-between items-center">
              <Link to={`/community/market/${postId}`}>
                <DamulButton variant="positive" className="w-32 h-7 text-xs">
                  원본 게시글 바로가기
                </DamulButton>
              </Link>
              {data?.data.id !== adminId && (
                <div onClick={handleExitRoom}>
                  <ExitIcon className="w-5 h-5 stroke-neutral-500 cursor-pointer" />
                </div>
              )}
            </div>
          ) : (
            <div className="flex justify-end" onClick={handleExitRoom}>
              <ExitIcon className="w-5 h-5 stroke-neutral-500 cursor-pointer" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChattingMenuButton;
