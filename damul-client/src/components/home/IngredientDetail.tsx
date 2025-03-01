import { Ingredient } from "@/types/Ingredient";
import DeleteIcon from "../svg/DeleteIcon";
import SaveIcon from "../svg/SaveIcon";
import { Slider } from "../ui/slider";
import { CATEGORY_ICON_MAPPER } from "@/constants/category";
import { deleteUserIndegredient, patchUserIndegredient } from "@/service/home";
import { useState } from "react";
import useAuth from "@/hooks/useAuth";
import DamulButton from "../common/DamulButton";
import CancelIcon from "../svg/CancelIcon";
import AlertCircleIcon from "../svg/AlertCircleIcon";
import { EXPIRINGSOON_DAY } from "@/constants/itemStatus";
import queryClient from "@/utils/queryClient";

interface IngredientDetailProps {
  selectedIngredient: Ingredient;
  updateIngredient?: (ingredient: Ingredient) => void;
  deleteIngredient?: (deletedIngredient: Ingredient) => void;
  setIngredients?: React.Dispatch<React.SetStateAction<Ingredient[]>>;
  setIsDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  readOnly?: boolean;
}

const InfoRow = ({
  label,
  labelStyle,
  value,
  valueStyle,
}: {
  label: string;
  labelStyle?: string;
  value: string;
  valueStyle?: string;
}) => (
  <div className="flex flex-col text-sm font-bold w-full">
    <div className={`text-positive-300 ${labelStyle}`}>{label}</div>
    <div className={valueStyle}>{value}</div>
  </div>
);

const getExpirationDate = (expirationDate: number): string => {
  const expiration = new Date();
  expiration.setDate(expiration.getDate() + expirationDate);

  return expiration
    .toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\. /g, "-")
    .replace(".", "");
};

const IngredientDetail = ({
  selectedIngredient,
  updateIngredient,
  deleteIngredient,
  setIngredients,
  setIsDeleteOpen,
  setIsOpen,
  readOnly,
}: IngredientDetailProps) => {
  const IconComponent = CATEGORY_ICON_MAPPER[selectedIngredient.categoryId];
  const [ingredient, setIngredient] = useState<Ingredient>(selectedIngredient);
  const { data, isLoading, refetch } = useAuth();

  if (isLoading) {
    return null;
  }

  const handleQuantityChange = (value: number[]) => {
    if (!readOnly) {
      setIngredient((prev) => {
        const updatedIngredient = {
          ...prev,
          ingredientQuantity: value[0],
        };

        setIngredients?.((prevItems) =>
          prevItems.map((item) =>
            item.userIngredientId === prev.userIngredientId
              ? updatedIngredient
              : item,
          ),
        );

        return updatedIngredient;
      });
    }
  };

  const handleDeleteClick = async () => {
    if (data?.data.warningEnabled) {
      setIsDeleteOpen(true);
    } else {
      try {
        await deleteUserIndegredient(
          ingredient.userIngredientId,
          data?.data.warningEnabled ? 1 : 0,
        );
        refetch();
        queryClient.refetchQueries({
          queryKey: ["ingredientData"],
          type: "all",
        });
        deleteIngredient?.(ingredient);
      } catch (error) {
        // console.log("식자재 정보를 삭제 하지 못했습니다.");
      }
    }
    setIsOpen?.(false);
  };

  const handleSaveClick = async () => {
    try {
      await patchUserIndegredient(ingredient.userIngredientId, {
        ingredientQuantity: ingredient.ingredientQuantity,
      });
      queryClient.refetchQueries({ queryKey: ["ingredientData"], type: "all" });
      updateIngredient?.(ingredient);
    } catch (error: any) {
      // console.error("식자재 정보를 수정하지 못했습니다.");
    }
    setIsOpen?.(false);
  };

  return (
    <div className="flex flex-col items-center w-full gap-4 p-5">
      <p className="w-full pb-3 text-xl font-bold text-center border-2der-b-2 text-positive-300 border-b-normal-50">
        식자재 상세보기
      </p>

      <div className="flex items-center justify-center w-full gap-4">
        <div className="relative flex items-center justify-center w-full h-full rounded-full border-2 border-normal-50">
          {selectedIngredient.expirationDate >= 0 &&
            selectedIngredient.expirationDate <= EXPIRINGSOON_DAY && (
              <AlertCircleIcon className="animate-pulse absolute size-12 top-0 left-0 stroke-negative-500" />
            )}
          {selectedIngredient.expirationDate < 0 && (
            <CancelIcon className="fill-negative-500 animate-pulse absolute size-12 top-0 left-0" />
          )}
          <IconComponent className="size-32 p-6 max-h-40" />
        </div>

        <div className="flex flex-col w-full gap-3">
          <InfoRow label="식자재명" value={selectedIngredient.ingredientName} />
          <InfoRow label="구매일" value={selectedIngredient.purchaseDate} />
          <InfoRow
            label="소비기한"
            value={getExpirationDate(selectedIngredient.expirationDate)}
            valueStyle={`${selectedIngredient.expirationDate <= EXPIRINGSOON_DAY && "text-negative-500 font-extrabold"}`}
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
      {!readOnly && (
        <div className="flex justify-between w-full gap-2">
          <DamulButton
            variant="negative"
            className="w-full active:scale-95"
            onClick={handleDeleteClick}
          >
            <DeleteIcon />
            <p className="text-xs pc:text-sm text-white">제거</p>
          </DamulButton>
          <DamulButton
            variant="positive"
            onClick={handleSaveClick}
            className="w-full active:scale-95"
          >
            <SaveIcon />
            <p className="text-xs pc:text-sm text-white">저장</p>
          </DamulButton>
        </div>
      )}
    </div>
  );
};

export default IngredientDetail;
