import { Dispatch, SetStateAction, useState } from "react";
import { IngredientProps } from "@/types/interfaces";
import PostDrawer from "@/components/community/PostDrawer";
import PostRecipeIngrediantForm from "@/components/community/PostRecipeIngrediantForm";
import SubmitButton from "./SubmitButton";

interface PostRecipeIngrediantsProps {
  setIngredients: Dispatch<SetStateAction<IngredientProps[]>>;
  ingredients: IngredientProps[];
}

const PostRecipeIngrediants = ({
  setIngredients,
  ingredients,
}: PostRecipeIngrediantsProps) => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");

  // 재료 삭제
  const handleRemoveIngredient = (id: number) => {
    setIngredients(ingredients.filter((ingredient) => ingredient.id !== id));
  };

  const handleSubmit = () => {
    if (!name || !quantity || !unit) {
      return;
    }

    const newIngredient: IngredientProps = {
      id: Date.now(),
      name,
      quantity,
      unit,
    };

    setIngredients((prev) => {
      let updatedIngredients = [...prev, newIngredient];

      // 첫 번째 요소가 비어있다면 제거
      if (
        updatedIngredients.length >= 2 &&
        (!updatedIngredients[0].name ||
          !updatedIngredients[0].quantity ||
          !updatedIngredients[0].unit)
      ) {
        updatedIngredients = updatedIngredients.slice(1);
      }

      return updatedIngredients;
    });

    setName("");
    setQuantity("");
    setUnit("");
  };

  return (
    <div className="overflow-x-hidden">
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="pc:w-24 p-6 text-left"></th>
            <th className="p-2 text-left">재료</th>
            <th className="p-2 text-left">수량</th>
            <th className="p-2 text-left">단위</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-300">
          {ingredients.map((ingredient) => (
            <tr key={ingredient.id}>
              <td className="p-5">
                <button
                  type="button"
                  onClick={() => handleRemoveIngredient(ingredient.id)}
                  className="flex items-center justify-center w-5 h-5 rounded-full text-negative-600 hover:negative-700 border-2 border-negative-600 text-xl font-semibold"
                >
                  -
                </button>
              </td>
              <td className="p-2">
                <input
                  type="text"
                  value={ingredient.name}
                  placeholder="재료"
                  className="w-full outline-none"
                  disabled
                />
              </td>
              <td className="p-2">
                <input
                  type="text"
                  value={ingredient.quantity}
                  placeholder="수량"
                  className="w-full outline-none"
                  disabled
                />
              </td>
              <td className="p-2">
                <input
                  type="text"
                  value={ingredient.unit}
                  placeholder="단위"
                  className="w-full outline-none"
                  disabled
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <PostDrawer
        trigerConent={
          <button
            type="button"
            className="text-blue-500 hover:text-blue-700 text-xl"
          >
            +
          </button>
        }
        headerContent={
          <PostRecipeIngrediantForm
            name={name}
            setName={setName}
            quantity={quantity}
            setQuantity={setQuantity}
            unit={unit}
            setUnit={setUnit}
          />
        }
        footerContent={<SubmitButton />}
        onFooterClick={handleSubmit}
      />
    </div>
  );
};

export default PostRecipeIngrediants;
