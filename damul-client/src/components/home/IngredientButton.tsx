import { MouseEventHandler } from "react";
import { CATEGORY } from "@/constants/category";
import DamulButton from "../common/DamulButton";
import AlertCircleIcon from "../svg/AlertCircleIcon";

interface IngredientButtonProps {
  variant: keyof typeof CATEGORY;
  name: string;
  quantity: number;
  expirationDate: number;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const IngredientButton = ({
  variant,
  name,
  quantity,
  expirationDate,
  onClick,
}: IngredientButtonProps) => {
  const IconComponent = CATEGORY[variant];
  return (
    <DamulButton
      onClick={onClick}
      className={`${expirationDate < 0 && "opacity-40"} bg-white h-full text-black flex items-center justify-center py-2 shadow-md border-1 border-normal-100 rounded-xl hover:bg-normal-100 focus:outline-none`}
    >
      <div className="relative">
        {expirationDate <= 7 && expirationDate > 0 && (
          <AlertCircleIcon className="stroke-negative-500 absolute scale-110 -left-4 bottom-4 z-10" />
        )}
      </div>
      <IconComponent className="scale-150" />
      <div className="flex flex-col w-full justify-center items-center">
        <div className="w-12 overflow-hidden text-sm font-bold text-ellipsis whitespace-nowrap">
          {name}
        </div>
        <div className="text-xs">{quantity}%</div>
      </div>
    </DamulButton>
  );
};

export default IngredientButton;
