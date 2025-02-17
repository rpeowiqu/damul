import DamulButton from "@/components/common/DamulButton";
import DamulModal from "@/components/common/DamulModal";
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
    <div className="flex flex-col p-5">
      <div className="flex flex-col mb-5">
        <div className="flex w-full gap-6 items-center text-xl font-bold">
          <button onClick={() => navigate("/home")} type="button">
            {"<"}
          </button>
          <p>선택된 식자재 리스트</p>
        </div>
        <div className="flex justify-end">
          <div className="flex items-center justify-end text-normal-300 text-sm gap-1">
            <p>총 {ingredients.length}개의 항목</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-10 items-center">
        {ingredients.length === 0 && (
          <div className="flex w-full flex-col h-60 items-center gap-5 justify-center">
            <p>편집할 식자재가 없습니다.</p>
            <DamulButton onClick={() => navigate("/home")}>
              홈으로 이동
            </DamulButton>
          </div>
        )}
        {ingredients.map((ingredient) => {
          return (
            <>
              <div
                key={ingredient.userIngredientId}
                className="border-4 w-full max-w-96 rounded-3xl border-positive-300"
              >
                <IngredientDetail
                  selectedIngredient={ingredient}
                  setIsDeleteOpen={() => setIsDeleteOpen(true)}
                  updateIngredient={updateIngredient}
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
    </div>
  );
};

export default HomeIngredientsEditPage;
