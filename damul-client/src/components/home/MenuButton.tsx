import DamulButton from "@/components/common/DamulButton";
import MenuIcon from "@/components/svg/MenuIcon";
import { useEffect, useRef, useState } from "react";

const MenuButton = () => {
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
    <div className="fixed w-full flex justify-end bottom-0 max-w-[600px]">
      <div ref={menuRef} className="relative">
        <div className="absolute z-40 flex flex-col items-center w-20 bottom-20 right-5">
          <div>
            <DamulButton
              variant="shadow"
              onClick={() => {
                setIsOpen((preState) => !preState);
              }}
            >
              <MenuIcon className="scale-150" />
            </DamulButton>
          </div>
          <div className="mt-1 text-center text-xxs">식자재 정리하기</div>
        </div>
        <div
          className={`absolute z-50 border-1 p-1 bg-white rounded-xl shadow-md bottom-32 right-16 flex gap-3 ${!isOpen && "hidden"}`}
        >
          <div className="w-10 h-10">식자재 추가</div>
          <div className="w-10 h-10">식자재 일괄수정</div>
        </div>
      </div>
    </div>
  );
};

export default MenuButton;
