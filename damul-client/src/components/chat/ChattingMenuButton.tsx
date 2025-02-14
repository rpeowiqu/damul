import MenuIcon from "@/components/svg/MenuIcon";
import { useEffect, useRef, useState } from "react";
import Image from "../common/Image";
import ExitIcon from "../svg/ExitIcon";
import { getChattingMembers } from "@/service/chatting";
import { ChattingMember } from "@/types/chatting";

interface ChattingMenuButtonProps {
  roomId: number;
}

const ChattingMenuButton = ({ roomId }: ChattingMenuButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [memberData, setMemberData] = useState<ChattingMember[]>();
  const [memberCnt, setMemberCnt] = useState(0);

  const menuRef = useRef<HTMLDivElement>(null);

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
      console.log(response?.data);
      setMemberData(response?.data.content);
      setMemberCnt(response?.data.totalMembers);
      return response?.data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="">
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
          {memberData?.map((data) => (
            <div key={data.id} className="flex justify-between items-center">
              <div className="flex items-center gap-3 text-sm font-normal cursor-pointer">
                <Image
                  src={data.profileImageUrl}
                  className="w-10 h-10 rounded-full"
                />
                <div>{data.nickname}</div>
              </div>
              <div className="text-sm font-normal text-negative-600 cursor-pointer">
                강제 퇴장
              </div>
            </div>
          ))}
          <div className="flex justify-between items-center">
            <span className="font-normal w-32 p-1 text-center text-xs border-2 border-positive-300 rounded-lg cursor-pointer">
              원본 게시글 바로가기
            </span>
            <ExitIcon className="w-5 h-5 stroke-neutral-500 cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChattingMenuButton;
