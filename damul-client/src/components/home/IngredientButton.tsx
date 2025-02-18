import { MouseEventHandler } from "react";
import { CATEGORY_INFO } from "@/constants/category";
import DamulButton from "../common/DamulButton";
import AlertCircleIcon from "../svg/AlertCircleIcon";
import { useIngredientStore } from "@/stores/ingredientStore";

interface IngredientButtonProps {
  id: number;
  variant: number;
  title: "freezer" | "fridge" | "roomTemp" | "expiringSoon";
  name: string;
  quantity: number;
  expirationDate: number;
  onClick: MouseEventHandler<HTMLButtonElement>;
  onEdit?: boolean;
}

const IngredientButton = ({
  id,
  variant,
  title,
  name,
  quantity,
  expirationDate,
  onClick,
  onEdit,
}: IngredientButtonProps) => {
  const IconComponent = Object.values(CATEGORY_INFO)[variant - 1].icon;

  const { selectedIngredients } = useIngredientStore();

  const isSelected = selectedIngredients.some(
    (item) => item.userIngredientId === id,
  );

  const randomDelay = Math.floor(Math.random() * 5);

  return (
    <DamulButton
      onClick={onClick}
      className={`${expirationDate < 0 && "opacity-40"} ${randomDelay == 1 && title === "freezer" && "animate-shiver"} hover:animate-wave bg-white h-full text-black flex items-center justify-center py-2 shadow-md border-1 border-normal-100 rounded-xl hover:bg-normal-100 focus:outline-none ${onEdit && "border-2 border-positive-300"} transition ease-in-out duration-1500 active:scale-75`}
    >
      <div className="relative">
        {expirationDate <= 7 && expirationDate > 0 && (
          <AlertCircleIcon className="animate-pulse duration-1000 stroke-negative-500 absolute scale-110 -left-4 bottom-4 fill-white" />
        )}
        {onEdit && (
          <input
            type="checkbox"
            className={`
            absolute -right-24 bottom-4 w-4 h-4 appearance-none rounded border-2 border-positive-400 
            bg-white checked:bg-positive-500  checked:border-positive-600 
            cursor-pointer transition-all 
            flex items-center justify-center
            before:content-['✓'] before:text-white before:text-sm before:hidden 
            checked:before:block
          `}
            checked={isSelected}
            readOnly
          />
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
