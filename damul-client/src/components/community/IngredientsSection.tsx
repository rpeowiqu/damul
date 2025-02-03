interface Ingredient {
  id: number;
  name: string;
  amount: string;
  unit: string;
}

interface IngredientsSectionProps {
  ingredients: Ingredient[];
}
const IngredientsSection = ({ ingredients }: IngredientsSectionProps) => {
  return (
    <div className="py-3 text-start">
      <h3 className="p-3 text-lg font-semibold">재료</h3>
      <div className="bg-neutral-100 p-3 text-center">
        {ingredients.map((ingredient) => (
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
