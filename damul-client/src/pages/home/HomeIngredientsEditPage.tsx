import DamulButton from "@/components/common/DamulButton";
import DamulModal from "@/components/common/DamulModal";
import DamulSection from "@/components/common/DamulSection";
import ConfirmDeleteModal from "@/components/home/ConfirmDeleteModal";
import IngredientDeleteOverview from "@/components/home/IngredientDeleteOverview";
import IngredientDetail from "@/components/home/IngredientDetail";
import useAuth from "@/hooks/useAuth";
import { deleteUserIndegredients } from "@/service/home";
import { useIngredientStore } from "@/stores/ingredientStore";
import { Ingredient } from "@/types/Ingredient";
import queryClient from "@/utils/queryClient";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HomeIngredientsEditPage = () => {
  const { selectedIngredients } = useIngredientStore();
  const { data, refetch } = useAuth();
  const [warningEnabled, setWarningEnabled] = useState<boolean>(
    data?.data.warningEnabled,
  );

  const navigate = useNavigate();

  const [ingredients, setIngredients] =
    useState<Ingredient[]>(selectedIngredients);

  const [deleteIngredientIds, setDeleteIngredientIds] = useState<number[]>([]);

  const updateIngredient = (updatedIngredient: Ingredient) => {
    setIngredients((prevItems) => {
      if (prevItems.length === 1) {
        return [];
      }
      return prevItems.filter(
        (item) => item.userIngredientId !== updatedIngredient.userIngredientId,
      );
    });
  };

  const deletedIngredients = (deletedIngredientIds: number[]) => {
    setIngredients((prevItems) => {
      if (prevItems.length === 1) {
        return [];
      }
      return prevItems.filter(
        (item) => !deletedIngredientIds.includes(item.userIngredientId),
      );
    });
  };

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [isSelectMode, setIsSelectMode] = useState(false);

  const handSelectMode = () => {
    setIsSelectMode((preState) => {
      const newSelectMode = !preState;
      if (newSelectMode) {
        setDeleteIngredientIds(
          ingredients.map((ingredient) => ingredient.userIngredientId),
        );
      } else {
        setDeleteIngredientIds([]);
      }

      return newSelectMode;
    });
  };

  const handleCheckboxChange = (ingredientId: number) => {
    setDeleteIngredientIds((prevSelectedIds) => {
      if (prevSelectedIds.includes(ingredientId)) {
        return prevSelectedIds.filter((id) => id !== ingredientId);
      } else {
        return [...prevSelectedIds, ingredientId];
      }
    });
  };

  const handleClick = (ingredientId: number) => {
    handleCheckboxChange(ingredientId);
  };

  const requestDelete = async () => {
    try {
      await deleteUserIndegredients(
        deleteIngredientIds,
        warningEnabled ? 1 : 0,
      );
      queryClient.refetchQueries({ queryKey: ["ingredientData"], type: "all" });
      deletedIngredients(deleteIngredientIds);
      refetch();
      setDeleteIngredientIds([]);
      setIsSelectMode(false);
    } catch (error: any) {
      // console.log("식자재를 제거하지 못했습니다.");
      alert("식자재를 제거하지 못했습니다.");
    }
  };

  return (
    <DamulSection
      className={`${isSelectMode && "pb-40"}`}
      title={
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/home")} type="button">
            {"<"}
          </button>
          <p>선택된 식자재 리스트</p>
        </div>
      }
    >
      <div className="flex justify-between items-center py-2">
        <DamulButton
          variant="negative"
          className="w-20"
          onClick={handSelectMode}
        >
          일괄삭제
        </DamulButton>
        <p className="text-end text-sm">총 {ingredients.length}개의 항목</p>
      </div>

      <div className="flex flex-col gap-8 items-center">
        {ingredients.length === 0 && (
          <div className="flex w-full flex-col h-60 items-center gap-5 justify-center">
            <p className="text-normal-300">편집할 식자재가 없습니다.</p>
            <DamulButton variant="positive" onClick={() => navigate("/home")}>
              홈으로 이동
            </DamulButton>
          </div>
        )}
        {ingredients.map((ingredient) => {
          const isSelected = deleteIngredientIds.includes(
            ingredient.userIngredientId,
          );

          return (
            <div
              key={ingredient.userIngredientId}
              className="flex items-center gap-5 w-full relative justify-center"
            >
              {isSelectMode && (
                <>
                  <div
                    onClick={() => handleClick(ingredient.userIngredientId)}
                    className={`absolute z-40 w-full h-full ${isSelected ? "bg-positive-100/20" : "bg-transparent"} cursor-pointer`}
                  ></div>
                  <div className="flex-1 flex justify-center items-center">
                    <input
                      type="checkbox"
                      className={`w-8 h-8 appearance-none rounded border-2 border-positive-400 
                            bg-white checked:bg-positive-500  checked:border-positive-600 
                            cursor-pointer transition-all 
                            flex items-center justify-center
                            before:content-['✓'] before:text-white before:text-3xl before:hidden 
                            checked:before:block z-50`}
                      checked={isSelected}
                      onChange={() =>
                        handleCheckboxChange(ingredient.userIngredientId)
                      }
                    />
                  </div>
                </>
              )}

              <div
                key={ingredient.userIngredientId}
                className="border-4 w-full max-w-88 rounded-3xl border-positive-300"
              >
                <IngredientDetail
                  selectedIngredient={ingredient}
                  setIngredients={setIngredients}
                  setIsDeleteOpen={() => setIsDeleteOpen(true)}
                  updateIngredient={updateIngredient}
                  deleteIngredient={updateIngredient}
                />
              </div>
              <DamulModal
                isOpen={isDeleteOpen}
                onOpenChange={() => setIsDeleteOpen(false)}
              >
                <ConfirmDeleteModal
                  setIsDeleteOpen={setIsDeleteOpen}
                  ingredient={ingredient}
                  deleteIngredient={updateIngredient}
                />
              </DamulModal>
            </div>
          );
        })}
      </div>
      {isSelectMode && (
        <IngredientDeleteOverview
          deleteIngredientIds={deleteIngredientIds}
          onClose={handSelectMode}
          onDelete={requestDelete}
        />
      )}
    </DamulSection>
  );
};

export default HomeIngredientsEditPage;
