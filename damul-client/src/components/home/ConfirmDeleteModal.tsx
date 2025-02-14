import { Ingredient } from "@/types/Ingredient";
import DeleteIcon from "../svg/DeleteIcon";
import { deleteUserIndegredient } from "@/service/home";
import useUserStore from "@/stores/user";

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
  const myWarningEnabled = useUserStore((state) => state.myWarningEnabled);
  const setWarningEnabled = useUserStore((state) => state.setWarningEnabled);
  const handleOnDelete = async () => {
    try {
      await deleteUserIndegredient(
        ingredient.userIngredientId,
        myWarningEnabled ? 1 : 0,
      );
      deleteIngredient(ingredient);
    } catch (error) {
      console.log("식자재 정보를 삭제 하지 못했습니다.");
    }
    setIsDeleteOpen(false);
  };
  const handleOnClose = async () => {
    setIsDeleteOpen(false);
    setIsOpen?.(true);
  };

  const handleDeleteCheck = () => {
    setWarningEnabled(!myWarningEnabled);
  };

  return (
    <div className="flex flex-col items-center gap-5 rounded-xl">
      <p className="w-full pb-4 text-xl font-bold text-center border-b-2 text-positive-300 border-b-normal-50">
        정말 삭제할까요?
      </p>
      <p className="text-center text-md text-normal-300">
        삭제된 데이터는 복구할 수 없습니다.
      </p>
      <div className="flex justify-between w-full gap-4">
        <button
          onClick={handleOnDelete}
          className="flex items-center justify-center w-1/2 gap-2 py-2 rounded-lg bg-negative-300"
        >
          <DeleteIcon />
          <p className="text-sm text-white">삭제하기</p>
        </button>
        <button
          onClick={handleOnClose}
          className="flex items-center justify-center w-1/2 gap-2 py-2 rounded-lg bg-normal-400 px-7"
        >
          <p className="text-sm text-white">뒤로가기</p>
        </button>
      </div>

      <div className="flex items-center w-full p-3">
        <input
          type="checkbox"
          id="delete-check"
          name="delete-check"
          onClick={handleDeleteCheck}
        />
        <label
          htmlFor="delete-check"
          className=" cursor-pointer text-sm text-normal-300 pl-2"
        >
          재확인 팝업 다시 보지 않기
        </label>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
