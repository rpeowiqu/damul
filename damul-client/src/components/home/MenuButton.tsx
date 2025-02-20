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
        <div className="absolute z-40 flex flex-col items-center w-12 bottom-20 right-5 pc:right-8">
          <div className="flex justify-center w-12 h-12">
            <DamulButton
              variant="shadow"
              onClick={() => {
                setIsOpen((preState) => !preState);
                clearSelectedIngredients();
              }}
              className="w-full h-full transition ease-in-out duration-150 active:scale-75 rounded-full"
            >
              <WriteIcon />
            </DamulButton>
          </div>
        </div>

        <div
          className={`absolute bg-white p-1 z-50 border-1 rounded-xl shadow-md bottom-28 right-14 flex items-center ${!isOpen && "hidden"}`}
        >
          <DamulButton
            onClick={() => navigate("/home/register")}
            className="bg-white h-full flex flex-col w-20 rounded-lg transition duration-200
          hover:bg-normal-50 hover:shadow-sm focus:outline-none items-center justify-center"
          >
            <PlusIcon className="fill-normal-500" />
            <p className="text-xxs leading-3 text-normal-500">
              식자재 <br /> 추가
            </p>
          </DamulButton>
          <DamulButton
            onClick={onClick}
            className="bg-white h-full flex flex-col w-20 rounded-lg transition duration-200 
          hover:bg-normal-50 hover:shadow-sm focus:outline-none items-center justify-center"
          >
            <EditIcon />
            <p className="text-xxs leading-3 text-normal-500">
              식자재
              <br />
              일괄수정
            </p>
          </DamulButton>
        </div>
      </div>
    </div>
  );
};

export default MenuButton;
