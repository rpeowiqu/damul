import Skeleton from "react-loading-skeleton";
import { Ingredient } from "@/types/community";

interface IngredientsSectionProps {
  ingredients: Ingredient[];
  isLoading: boolean;
}
const IngredientsSection = ({
  ingredients,
  isLoading,
}: IngredientsSectionProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col text-start">
        <Skeleton width={60} height={20} className="mt-10" />
        <Skeleton width="100%" height={100} />
      </div>
    );
  }
  return (
    <div className="text-start">
      <h3 className="text-md pc:text-lg font-semibold">재료</h3>
      <div className="bg-neutral-100 p-3 text-center text-sm pc:text-md">
        {ingredients?.map((ingredient) => (
          <div key={ingredient.id} className="flex justify-center text-center">
            <p className="font-bold pr-2">{ingredient.name}</p>
            <p>
              {ingredient.amount} {ingredient.unit}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IngredientsSection;
