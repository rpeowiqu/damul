import { Ingredient } from "@/types/Ingredient";
import DeleteIcon from "../svg/DeleteIcon";
import SaveIcon from "../svg/SaveIcon";
import { Slider } from "../ui/slider";
import { CATEGORY, CATEGORYNUMBER } from "@/constants/category";

interface IngredientDetailProps {
  ingredient: Ingredient;
  onQuantityChange: (value: number[]) => void;
  setIsDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col font-bold">
    <p className="text-positive-300">{label}</p>
    <p className="text-sm">{value}</p>
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
    className={`flex items-center justify-center gap-2 py-2 rounded-lg bg-positive-300 px-7 ${className}`}
    onClick={onClick}
  >
    <Icon />
    <p className="text-xs pc:text-sm text-white">{text}</p>
  </button>
);

const IngredientDetail = ({
  ingredient,
  onQuantityChange,
  setIsDeleteOpen,
  setIsOpen,
}: IngredientDetailProps) => {
  const IconComponent = CATEGORY[CATEGORYNUMBER[ingredient.categoryId]];

  const handleDeleteClick = () => {
    setIsDeleteOpen(true);
    setIsOpen(false);
  };

  const handleSaveClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <p className="w-full pb-4 text-xl font-bold text-center border-b-2 text-positive-300 border-b-normal-50">
        식자재 상세보기
      </p>

      <div className="flex items-center justify-center w-full p-6 gap-4">
        <div className="flex items-center justify-center w-full border-2 p-7 rounded-full border-normal-50">
          <IconComponent className="w-full h-full" />
        </div>

        <div className="flex flex-col  w-full gap-3">
          <InfoRow label="식자재명" value={ingredient.ingredientName} />
          <InfoRow label="구매일" value="2025-02-04" />
          <InfoRow label="소비기한" value="2025-03-16" />
        </div>
      </div>

      <div className="flex flex-col w-full gap-1">
        <div className="flex justify-between">
          <p className="text-sm text-positive-300">다 썼어요</p>
          <p className="text-sm text-positive-300">넉넉해요!</p>
        </div>
        <div className="flex justify-center">
          <Slider
            className="w-full px-5"
            onValueChange={onQuantityChange}
            defaultValue={[ingredient.ingredientQuantity]}
            max={100}
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
          text="즉시 제거하기"
          className="w-1/2"
          onClick={handleDeleteClick}
        />
        <ActionButton
          onClick={handleSaveClick}
          icon={SaveIcon}
          text="저장하기"
          className="w-1/2"
        />
      </div>
    </div>
  );
};

export default IngredientDetail;
