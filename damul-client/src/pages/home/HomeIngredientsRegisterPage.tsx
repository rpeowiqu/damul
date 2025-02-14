import DamulButton from "@/components/common/DamulButton";
import IngredientItem from "@/components/home/IngredientItem";
import OcrButton from "@/components/home/OcrButton";
import PlusIcon from "@/components/svg/PlusIcon";
import { initialIngredientRegisterData } from "@/constants/initialData";
import { postUserIndegredient } from "@/service/home";
import { RegisterIngredientData } from "@/types/Ingredient";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LIMIT_ADD_COUNT = 50;

const HomeIngredientsRegisterPage = () => {
  const [ingredientRegisterData, setIngredientRegisterData] =
    useState<RegisterIngredientData>(initialIngredientRegisterData);

  const navigate = useNavigate();

  const handleResetData = () => {
    setIngredientRegisterData(initialIngredientRegisterData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index?: number,
    field?: string,
  ) => {
    const { name, value } = e.target;
    const parsedValue = ["productPrice", "categoryId"].includes(field ?? name)
      ? Number(value)
      : value;

    setIngredientRegisterData((prevData) => {
      if (name === "storeName" || name === "purchaseAt") {
        return {
          ...prevData,
          [name]: value,
        };
      }

      if (
        name === "ingredientName" ||
        name === "productPrice" ||
        name === "categoryId" ||
        name === "expirationDate" ||
        name === "ingredientStorage"
      ) {
        const updatedIngredients = [...prevData.userIngredients];
        if (index !== undefined && field !== undefined) {
          updatedIngredients[index] = {
            ...updatedIngredients[index],
            [field]: parsedValue,
          };
        }

        return {
          ...prevData,
          userIngredients: updatedIngredients,
        };
      }

      return prevData;
    });
  };

  const addIngredient = () => {
    if (ingredientRegisterData.userIngredients.length <= LIMIT_ADD_COUNT) {
      setIngredientRegisterData((prev) => ({
        ...prev,
        userIngredients: [
          ...prev.userIngredients,
          {
            ingredientName: "",
            productPrice: 0,
            categoryId: 0,
            expirationDate: "",
            ingredientStorage: "FRIDGE",
          },
        ],
      }));
    } else {
      alert(
        "효과적인 식자재 등록을 위해 식자재 등록 후 이용해주시길 바랍니다.",
      );
    }
  };

  const removeIngredient = (index: number) => {
    setIngredientRegisterData((prev) => {
      const updatedIngredients = prev.userIngredients.filter(
        (_, i) => i !== index,
      );

      if (prev.userIngredients.length === 1) {
        return {
          ...prev,
          userIngredients: [...ingredientRegisterData.userIngredients],
        };
      }

      return { ...prev, userIngredients: updatedIngredients };
    });
  };

  const totalAmount = ingredientRegisterData.userIngredients.reduce(
    (sum, item) => sum + (Number(item.productPrice) || 0),
    0,
  );

  const handleRegisterIngredients = async () => {
    try {
      await postUserIndegredient(ingredientRegisterData);
      navigate("/home");
    } catch (error: any) {
      console.log("식자재를 등록하지 못했습니다.");
      alert("식자재를 등록하지 못했습니다.");
    }
  };

  return (
    <div className="flex flex-col p-5">
      <div className="flex w-full gap-6 items-center text-xl font-bold">
        <button type="button" onClick={() => navigate("/home")}>
          {"<"}
        </button>
        <p>식자재 등록하기</p>
      </div>
      <p className="text-positive-300 font-bold p-1">
        오늘은 이런 품목을 구매하셨네요!
      </p>
      <div className="flex justify-between">
        <DamulButton
          onClick={handleResetData}
          className="flex bg-white items-center justify-end text-normal-300 text-sm gap-1"
        >
          <PlusIcon className="w-6 h-full text-normal-300 fill-normal-200 stroke-2 stroke-normal-200" />
          <p>초기화</p>
        </DamulButton>

        <OcrButton setIngredientRegisterData={setIngredientRegisterData} />
      </div>

      <div className="my-4 flex flex-col gap-3">
        <div className="flex w-full gap-2">
          <div className="w-full flex flex-col gap-2">
            <label className="cursor-pointer" htmlFor="storeName">
              매장명
            </label>
            <input
              name="storeName"
              id="storeName"
              type="text"
              value={ingredientRegisterData.storeName}
              onChange={handleChange}
              className="border-1 w-full focus:outline-positive-300"
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <label className="cursor-pointer" htmlFor="purchaseAt">
              날짜
            </label>
            <input
              name="purchaseAt"
              type="date"
              value={ingredientRegisterData.purchaseAt}
              onChange={handleChange}
              className="border-1 focus:outline-positive-300"
            />
          </div>
        </div>
        <div className="flex flex-col gap-4 h-60 overflow-y-auto">
          {ingredientRegisterData.userIngredients.map((ingredient, index) => (
            <IngredientItem
              key={`${ingredient.categoryId} ${Math.random()}`}
              ingredient={ingredient}
              onChange={(e) => handleChange(e, index, e.target.name)}
              onDelete={() => removeIngredient(index)}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-2 font-bold">
        총 구매 금액:
        <span className="text-positive-300">
          {totalAmount.toLocaleString()}
        </span>
        원
      </div>
      <div className="flex justify-center p-2">
        <DamulButton className="bg-normal-200" onClick={addIngredient}>
          +
        </DamulButton>
      </div>
      <DamulButton
        onClick={handleRegisterIngredients}
        className="bg-positive-300 hover:bg-positive-300/60"
      >
        등록
      </DamulButton>
    </div>
  );
};

export default HomeIngredientsRegisterPage;
