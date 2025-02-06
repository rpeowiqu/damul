import MenuIcon from "@/components/svg/MenuIcon";
import { useEffect, useRef, useState } from "react";
import Image from "../common/Image";
import ExitIcon from "../svg/ExitIcon";

const mockData = [
  { id: 1, name: "나", imageUrl: "" },
  { id: 2, name: "사용자1", imageUrl: "" },
  { id: 3, name: "사용자2", imageUrl: "" },
  { id: 4, name: "사용자3", imageUrl: "" },
];

const ChattingMenuButton = () => {
  const [isOpen, setIsOpen] = useState(false);

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
          <div className="font-semibold">참여자(4)</div>

          {/* 참여자 목록 */}
          {mockData.map((data) => (
            <div key={data.id} className="flex justify-between items-center">
              <div className="flex items-center gap-3 text-sm font-normal cursor-pointer">
                <Image src={data.imageUrl} className="w-10 h-10 rounded-full" />
                <div>{data.name}</div>
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
