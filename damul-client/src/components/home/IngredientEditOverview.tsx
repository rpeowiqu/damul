import { useIngredientStore } from "@/stores/ingredientStore";
import DamulButton from "../common/DamulButton";
import { useNavigate } from "react-router-dom";

interface IngredientEditOverviewProps {
  onClose: () => void;
}

const IngredientEditOverview = ({ onClose }: IngredientEditOverviewProps) => {
  const { selectedIngredients } = useIngredientStore();
  const navigate = useNavigate();

  return (
    <div
      className={`fixed rounded-t-3xl w-full h-48 p-5 flex flex-col gap-5 bottom-5 max-w-[600px] bg-white border-4 border-positive-200`}
    >
      <p className="text-lg flex gap-2">
        <span>선택된 식자재 개수 : </span>
        <span className="text-xl font-bold">
          {selectedIngredients.length}개
        </span>
      </p>
      <div className="flex w-full justify-center gap-5">
        <DamulButton
          onClick={() => navigate("/home/edit")}
          className="bg-positive-300 w-full hover:bg-positive-400"
          disabled={selectedIngredients.length === 0}
        >
          편집
        </DamulButton>
        <DamulButton
          onClick={onClose}
          className="bg-normal-300 hover:bg-normal-400 w-full"
        >
          닫기
        </DamulButton>
      </div>
    </div>
  );
};

export default IngredientEditOverview;
