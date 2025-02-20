import { Ingredient } from "@/types/Ingredient";
import DeleteIcon from "../svg/DeleteIcon";
import { deleteUserIndegredient } from "@/service/home";
import useAuth from "@/hooks/useAuth";
import { useState } from "react";
import DamulButton from "../common/DamulButton";
import { Input } from "../ui/input";

interface ConfirmDeleteModalProps {
  setIsDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  ingredient: Ingredient;
  deleteIngredient: (ingredient: Ingredient) => void;
}

const ConfirmDeleteModal = ({
  ingredient,
  setIsOpen,
  setIsDeleteOpen,
  deleteIngredient,
}: ConfirmDeleteModalProps) => {
  const { data, isLoading, refetch } = useAuth();
  const [warningEnabled, setWarningEnabled] = useState<boolean>(
    data?.data.warningEnabled,
  );

  const handleOnDelete = async () => {
    try {
      await deleteUserIndegredient(
        ingredient.userIngredientId,
        warningEnabled ? 1 : 0,
      );
      refetch();
      deleteIngredient(ingredient);
    } catch (error) {
      // console.log("식자재 정보를 삭제 하지 못했습니다.");
    }
    setIsDeleteOpen(data?.data.warningEnabled);
  };
  const handleOnClose = async () => {
    setIsDeleteOpen(false);
    setIsOpen?.(true);
  };

  const handleDeleteCheck = () => {
    setWarningEnabled(!warningEnabled);
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-5 rounded-xl">
      <p className="w-full pb-4 text-xl font-bold text-center border-b-2 text-positive-300 border-b-normal-50">
        정말 삭제할까요?
      </p>
      <p className="text-center text-md text-normal-300">
        삭제된 데이터는 복구할 수 없습니다.
      </p>
      <div className="flex justify-between w-full gap-4">
        <DamulButton
          onClick={handleOnDelete}
          className="flex hover:bg-negative-400 items-center justify-center w-1/2 gap-2 py-2 rounded-lg bg-negative-300"
        >
          <DeleteIcon />
          <p className="text-sm text-white">삭제하기</p>
        </DamulButton>
        <DamulButton
          onClick={handleOnClose}
          className="flex items-center hover:bg-normal-600 justify-center w-1/2 gap-2 py-2 rounded-lg bg-normal-400 px-7"
        >
          <p className="text-sm text-white">뒤로가기</p>
        </DamulButton>
      </div>

      <div className="flex items-center w-full p-3">
        <Input
          type="checkbox"
          id="delete-check"
          name="delete-check"
          className="w-1 p-2 h-1 appearance-none rounded border-2 border-positive-400 
            bg-white checked:bg-positive-500  checked:border-positive-600 
            cursor-pointer transition-all 
            flex items-center justify-center
            before:content-['✓'] before:text-white before:text-sm before:hidden 
            checked:before:block"
          onClick={handleDeleteCheck}
        />
        <label
          htmlFor="delete-check"
          className="cursor-pointer text-sm text-normal-300 pl-2"
        >
          재확인 팝업 다시 보지 않기
        </label>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
