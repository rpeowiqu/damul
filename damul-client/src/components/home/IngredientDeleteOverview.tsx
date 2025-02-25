import DamulButton from "../common/DamulButton";

interface IngredientDeleteOverviewProps {
  deleteIngredientIds: number[];
  onClose: () => void;
  onDelete: () => void;
}

const IngredientDeleteOverview = ({
  deleteIngredientIds,
  onClose,
  onDelete,
}: IngredientDeleteOverviewProps) => {
  return (
    <div className="mx-auto w-full">
      <div
        className={`fixed w-full max-w-[600px] rounded-t-3xl px-5 py-6 flex flex-col justify-center gap-4 bottom-16 bg-white border-t-4 border-t-positive-200 border-x-4 border-x-positive-200 z-50`}
      >
        <p className="flex items-center gap-2 font-bold">
          <span>선택된 식자재 개수 : </span>
          <span className="text-lg">{deleteIngredientIds.length}개</span>
        </p>
        <div className="flex w-full justify-center gap-5">
          <DamulButton onClick={onClose} variant="negative" className="w-full">
            닫기
          </DamulButton>
          <DamulButton
            variant="positive"
            onClick={onDelete}
            disabled={deleteIngredientIds.length === 0}
            className="w-full"
          >
            삭제
          </DamulButton>
        </div>
      </div>
    </div>
  );
};

export default IngredientDeleteOverview;
