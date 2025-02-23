import DamulButton from "@/components/common/DamulButton";
import DamulModal from "@/components/common/DamulModal";
import DamulSection from "@/components/common/DamulSection";
import ConfirmDeleteModal from "@/components/home/ConfirmDeleteModal";
import IngredientDetail from "@/components/home/IngredientDetail";
import { useIngredientStore } from "@/stores/ingredientStore";
import { Ingredient } from "@/types/Ingredient";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HomeIngredientsEditPage = () => {
  const { selectedIngredients } = useIngredientStore();
  const navigate = useNavigate();

  const [ingredients, setIngredients] =
    useState<Ingredient[]>(selectedIngredients);

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

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <DamulSection
      title={
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/home")} type="button">
            {"<"}
          </button>
          <p>선택된 식자재 리스트</p>
        </div>
      }
    >
      <>
        <p className="text-end text-sm">총 {ingredients.length}개의 항목</p>

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
            return (
              <>
                <div
                  key={ingredient.userIngredientId}
                  className="border-4 w-full max-w-88 rounded-3xl border-positive-300"
                >
                  <IngredientDetail
                    selectedIngredient={ingredient}
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
              </>
            );
          })}
        </div>
      </>
    </DamulSection>
  );
};

export default HomeIngredientsEditPage;
