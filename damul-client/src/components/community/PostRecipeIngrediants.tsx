import { Dispatch, SetStateAction, useState } from "react";
import { IngredientProps } from "@/types/community";
import PostRecipeIngrediantForm from "@/components/community/PostRecipeIngrediantForm";
import SubmitButton from "./SubmitButton";
import useCloseOnBack from "@/hooks/useCloseOnBack";
import DamulDrawer from "@/components/common/DamulDrawer";

interface PostRecipeIngrediantsProps {
  setTempIngredients: Dispatch<SetStateAction<IngredientProps[]>>;
  tempIngredients: IngredientProps[];
}

const PostRecipeIngrediants = ({
  setTempIngredients,
  tempIngredients,
}: PostRecipeIngrediantsProps) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("");
  const [isOpen, setIsOpen] = useCloseOnBack();

  // 재료 삭제
  const handleRemoveIngredient = (id: number) => {
    setTempIngredients(
      tempIngredients.filter((ingredient) => ingredient.id !== id),
    );
  };

  const handleSubmit = () => {
    if (!name || !amount || !unit) {
      return;
    }

    const newIngredient: IngredientProps = {
      id: Date.now(),
      name,
      amount,
      unit,
    };

    setTempIngredients((prev) => {
      let updatedIngredients = [...prev, newIngredient];

      // 첫 번째 요소가 비어있다면 제거
      if (
        updatedIngredients.length >= 2 &&
        (!updatedIngredients[0].name ||
          !updatedIngredients[0].amount ||
          !updatedIngredients[0].unit)
      ) {
        updatedIngredients = updatedIngredients.slice(1);
      }

      return updatedIngredients;
    });

    setName("");
    setAmount("");
    setUnit("");
  };

  return (
    <div className="overflow-x-hidden flex flex-col">
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="p-6 text-left"></th>
            <th className="p-2 text-left">재료</th>
            <th className="p-2 text-left">수량</th>
            <th className="p-2 text-left">단위</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-300">
          {tempIngredients.map((ingredient) => (
            <tr key={ingredient.id}>
              <td className="p-1">
                {ingredient.name && (
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(ingredient.id)}
                    className="flex items-center justify-center w-5 h-5 rounded-full text-negative-600 hover:negative-700 border-2 border-negative-600 text-xl font-semibold"
                  >
                    -
                  </button>
                )}
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
                  value={ingredient.amount}
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
      <DamulDrawer
        isOpen={isOpen}
        onOpenChange={() => {
          if (isOpen) {
            history.back();
          }
        }}
        triggerContent={
          <div className="text-blue-400 hover:text-blue-700 text-2xl mt-5">
            +
          </div>
        }
        headerContent={
          <PostRecipeIngrediantForm
            name={name}
            setName={setName}
            amount={amount}
            setAmount={setAmount}
            unit={unit}
            setUnit={setUnit}
          />
        }
        footerContent={<SubmitButton />}
        onFooterClick={handleSubmit}
        onTriggerClick={() => setIsOpen(true)}
      />
    </div>
  );
};

export default PostRecipeIngrediants;
