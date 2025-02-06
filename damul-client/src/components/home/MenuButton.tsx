import DamulButton from "@/components/common/DamulButton";
import MenuIcon from "@/components/svg/MenuIcon";
import { useEffect, useRef, useState } from "react";
import PlusIcon from "../svg/PlusIcon";
import EditIcon from "../svg/EditIcon";

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
          className={`absolute z-50 border-1 p-1 bg-white rounded-xl shadow-md bottom-32 right-16 flex ${!isOpen && "hidden"}`}
        >
          <button
            className="flex flex-col justify-center items-center w-20 rounded-lg transition duration-200 
          hover:bg-normal-50 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-normal-200 p-2"
          >
            <PlusIcon />
            <p className="text-xxs">식자재 추가</p>
          </button>
          <button
            className="flex flex-col justify-center items-center w-20 rounded-lg transition duration-200 
          hover:bg-normal-50 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-normal-200 p-2"
          >
            <EditIcon className="w-6" />
            <p className="text-xxs">식자재 일괄수정</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuButton;
