import { Ingredient } from "@/types/Ingredient";
import DeleteIcon from "../svg/DeleteIcon";
import SaveIcon from "../svg/SaveIcon";
import { Slider } from "../ui/slider";
import { CATEGORY, CATEGORYNUMBER } from "@/constants/category";
import { patchUserIndegredient } from "@/service/home";
import { useEffect, useState } from "react";

interface IngredientDetailProps {
  selectedIngredient: Ingredient;
  updateIngredient?: (ingredient: Ingredient) => void;
  setIsDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col text-sm font-bold w-full">
    <p className="text-positive-300">{label}</p>
    <p>{value}</p>
  </div>
);

const ActionButton = ({
  icon: Icon,
  text,
  className = "",
  onClick,
}: {
  icon: React.ElementType;
  text: string;
  className?: string;
  onClick?: () => void;
}) => (
  <button
    className={`flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-positive-300 px-7 ${className}`}
    onClick={onClick}
  >
    <Icon />
    <p className="text-xs pc:text-sm text-white">{text}</p>
  </button>
);

const getExpirationDate = (
  purchaseDate: string,
  expirationDate: number,
): string => {
  const purchase = new Date(purchaseDate);
  purchase.setDate(purchase.getDate() + expirationDate);

  return purchase.toISOString().split("T")[0];
};

const IngredientDetail = ({
  selectedIngredient,
  updateIngredient,
  setIsDeleteOpen,
  setIsOpen,
}: IngredientDetailProps) => {
  const IconComponent = CATEGORY[CATEGORYNUMBER[selectedIngredient.categoryId]];

  const [ingredient, setIngredient] = useState<Ingredient>(selectedIngredient);
  const handleQuantityChange = (value: number[]) => {
    setIngredient((prev) => {
      return {
        ...prev,
        ingredientQuantity: value[0],
      };
    });
  };

  const handleDeleteClick = () => {
    setIsDeleteOpen(true);
    setIsOpen?.(false);
  };

  const handleSaveClick = async () => {
    try {
      await patchUserIndegredient(ingredient.userIngredientId, {
        ingredientQuantity: ingredient.ingredientQuantity,
      });
      updateIngredient?.(ingredient);
    } catch (error) {
      console.error("식자재 정보를 수정하지 못했습니다.");
    }
    setIsOpen?.(false);
  };

  useEffect(() => {
    setIngredient(selectedIngredient);
  }, [selectedIngredient]);

  return (
    <div className="flex flex-col items-center w-full gap-4 p-5">
      <p className="w-full pb-3 text-xl font-bold text-center border-b-2 text-positive-300 border-b-normal-50">
        식자재 상세보기
      </p>

      <div className="flex items-center justify-center w-full gap-4">
        <div className="flex items-center justify-center w-full border-2 p-6 rounded-full border-normal-50">
          <IconComponent className="w-full h-full" />
        </div>

        <div className="flex flex-col w-full gap-3">
          <InfoRow label="식자재명" value={selectedIngredient.ingredientName} />
          <InfoRow label="구매일" value={selectedIngredient.purchaseDate} />
          <InfoRow
            label="소비기한"
            value={getExpirationDate(
              selectedIngredient.purchaseDate,
              selectedIngredient.expirationDate,
            )}
          />
        </div>
      </div>

      <div className="flex flex-col w-full gap-1">
        <div className="flex justify-between">
          <p className="text-sm text-positive-300">다 썼어요</p>
          <p className="text-sm text-positive-300">넉넉해요!</p>
        </div>
        <div className="flex justify-center">
          <Slider
            className="w-full"
            onValueChange={handleQuantityChange}
            defaultValue={[selectedIngredient.ingredientQuantity]}
            max={100}
            value={[ingredient.ingredientQuantity]}
            step={1}
          />
        </div>
        <p className="flex items-center justify-center w-full gap-1 text-sm my-2">
          <span className="text-lg font-bold">
            {ingredient.ingredientQuantity}%
          </span>
          남았어요
        </p>
      </div>

      <div className="flex justify-between w-full gap-2">
        <ActionButton
          icon={DeleteIcon}
          text="제거"
          className="w-full"
          onClick={handleDeleteClick}
        />
        <ActionButton
          onClick={handleSaveClick}
          icon={SaveIcon}
          text="저장"
          className="w-full"
        />
      </div>
    </div>
  );
};

export default IngredientDetail;
