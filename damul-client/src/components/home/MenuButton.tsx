import DamulButton from "@/components/common/DamulButton";
import PlusIcon from "@/components/svg/PlusIcon";
import EditIcon from "@/components/svg/EditIcon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useClickOutside from "@/hooks/useClickOutside";
import { useIngredientStore } from "@/stores/ingredientStore";
import WriteIcon from "../svg/WriteIcon";

interface MenuButtonProps {
  onClick: () => void;
}

const MenuButton = ({ onClick }: MenuButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();
  const { clearSelectedIngredients } = useIngredientStore();

  const menuRef = useClickOutside<HTMLDivElement>(() => {
    clearSelectedIngredients();
    setIsOpen(false);
  });

  return (
    <div className="fixed w-full flex justify-end bottom-0 max-w-[600px] bg-white z-40">
      <div ref={menuRef} className="relative">
        <div className="absolute bottom-20 right-5 pc:right-8">
          <DamulButton
            onClick={() => {
              setIsOpen((preState) => !preState);
              clearSelectedIngredients();
            }}
            className="size-12 transition ease-in-out duration-150 active:scale-95 rounded-full bg-white hover:bg-positive-50 border-positive-300 border-2"
          >
            <WriteIcon className="scale-150 fill-positive-300" />
          </DamulButton>
        </div>

        <div
          className={`absolute bg-white p-1 z-50 border-1 rounded-xl shadow-md bottom-28 right-14 flex justify-center items-center ${!isOpen && "hidden"}`}
        >
          <DamulButton
            onClick={() => navigate("/home/register")}
            className="bg-white flex flex-col gap-2 w-20 h-full rounded-lg transition duration-200
          hover:bg-positive-50 hover:shadow-sm focus:outline-none items-center justify-center border-r border-r-normal-50"
          >
            <PlusIcon className="fill-normal-500 scale-150" />
            <p className="text-xs leading-3 text-normal-500">식자재 등록</p>
          </DamulButton>
          <DamulButton
            onClick={onClick}
            className="bg-white flex flex-col gap-2 w-20 h-full rounded-lg transition duration-200 
          hover:bg-positive-50 hover:shadow-sm focus:outline-none items-center justify-center border-r border-transparent"
          >
            <EditIcon className="fill-normal-500 scale-150" />
            <p className="text-xs leading-3 text-normal-500">일괄 수정</p>
          </DamulButton>
        </div>
      </div>
    </div>
  );
};

export default MenuButton;
