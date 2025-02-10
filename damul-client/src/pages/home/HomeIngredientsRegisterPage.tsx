import DamulButton from "@/components/common/DamulButton";
import IngredientItem from "@/components/home/IngredientItem";
import PlusIcon from "@/components/svg/PlusIcon";
import { useState } from "react";

const initialData = {
  purchaseAt: "2021-10-10",
  storeName: "홈플러스",
  userIngredients: [
    {
      ingredientName: "양파",
      productPrice: 1000,
      categoryId: 1,
      dueDate: "2021-10-20",
      ingredientStorage: "FREEZER",
    },
  ],
};

const HomeIngredientsRegisterPage = () => {
  const [ingredientRegisterData, setIngredientRegisterData] =
    useState(initialData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setIngredientRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleIngredientChange = (index, key, value) => {
    setIngredientRegisterData((prev) => {
      const updatedIngredients = [...prev.userIngredients];
      updatedIngredients[index] = {
        ...updatedIngredients[index],
        [key]: value,
      };
      return { ...prev, userIngredients: updatedIngredients };
    });
  };

  const addIngredient = () => {
    setIngredientRegisterData((prev) => ({
      ...prev,
      userIngredients: [
        ...prev.userIngredients,
        {
          ingredientName: "",
          productPrice: 0,
          categoryId: 0,
          dueDate: "",
          ingredientStorage: "FRIDGE",
        },
      ],
    }));
  };

  const removeIngredient = (index: number) => {
    setIngredientRegisterData((prev) => {
      const updatedIngredients = prev.userIngredients.filter(
        (_, i) => i !== index,
      );
      return { ...prev, userIngredients: updatedIngredients };
    });
  };

  const totalAmount = ingredientRegisterData.userIngredients.reduce(
    (sum, item) => sum + item.productPrice,
    0,
  );

  return (
    <div className="flex flex-col p-5">
      <div className="flex w-full gap-6 items-center text-xl font-bold">
        <button type="button">{"<"}</button>
        <p>식자재 등록하기</p>
      </div>
      <p className="p-4 text-positive-300 font-bold">
        오늘은 이런 품목을 구매하셨네요!
      </p>
      <div className="flex justify-end">
        <button className="flex items-center justify-end text-normal-300 text-sm gap-1">
          <PlusIcon className="w-6 h-full text-normal-300 fill-normal-200 stroke-2 stroke-normal-200" />
          <p>영수증으로 입력하기</p>
        </button>
      </div>

      <div className="my-4 flex flex-col gap-4">
        <div className="flex w-full gap-2">
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="shop">매장명</label>
            <input
              name="storeName"
              id="shop"
              type="text"
              value={ingredientRegisterData.storeName}
              onChange={handleInputChange}
              className="border-1 w-full focus:outline-positive-300"
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <label>날짜</label>
            <input
              name="purchaseAt"
              type="date"
              value={ingredientRegisterData.purchaseAt}
              onChange={handleInputChange}
              className="border-1 focus:outline-positive-300"
            />
          </div>
        </div>
        <div className="flex flex-col gap-4 h-[200px] overflow-y-auto">
          {ingredientRegisterData.userIngredients.map((ingredient, index) => (
            <IngredientItem
              key={index}
              ingredient={ingredient}
              onChange={(key, value) =>
                handleIngredientChange(index, key, value)
              }
              onDelete={() => removeIngredient(index)}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-2 font-bold">
        총 구매 금액: <span className="text-positive-300">{totalAmount}</span>원
      </div>
      <div className="flex justify-center p-4">
        <DamulButton className="bg-normal-200" onClick={addIngredient}>
          +
        </DamulButton>
      </div>
      <DamulButton className="bg-positive-300 hover:bg-positive-300/60">
        등록
      </DamulButton>
    </div>
  );
};

export default HomeIngredientsRegisterPage;
