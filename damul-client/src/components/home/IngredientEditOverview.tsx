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
      className={`fixed rounded-t-3xl w-full px-5 py-6 flex flex-col justify-center gap-4 bottom-16 max-w-[600px] bg-white border-t-4 border-t-positive-200 border-x-4 border-x-positive-200 z-40`}
    >
      <p className="flex items-center gap-2 font-bold">
        <span>선택된 식자재 개수 : </span>
        <span className="text-lg">{selectedIngredients.length}개</span>
      </p>
      <div className="flex w-full justify-center gap-5">
        <DamulButton variant="negative" onClick={onClose} className="w-full">
          닫기
        </DamulButton>
        <DamulButton
          variant="positive"
          onClick={() => navigate("/home/edit")}
          disabled={selectedIngredients.length === 0}
          className="w-full"
        >
          편집
        </DamulButton>
      </div>
    </div>
  );
};

export default IngredientEditOverview;
