import IngredientEditItem from "@/components/home/IngredientEditItem";
import { useIngredientStore } from "@/stores/ingredientStore";

const HomeIngredientsEditPage = () => {
  const { selectedIngredients, setSelectedIngredients } = useIngredientStore();

  return (
    <div className="flex flex-col p-5">
      <div className="flex flex-col mb-5">
        <div className="flex w-full gap-6 items-center text-xl font-bold">
          <button type="button">{"<"}</button>
          <p>선택된 식자재 리스트</p>
        </div>
        <div className="flex justify-end">
          <div className="flex items-center justify-end text-normal-300 text-sm gap-1">
            <p>총 {selectedIngredients.length}개의 항목</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-10 items-center">
        {selectedIngredients.map((selectedIngredient, idx) => {
          return (
            <div
              key={idx}
              className="border-4 p-10 rounded-3xl border-positive-300"
            >
              <IngredientEditItem ingredient={selectedIngredient} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HomeIngredientsEditPage;
