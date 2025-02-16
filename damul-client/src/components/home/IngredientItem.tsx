import { CATEGORY_INFO } from "@/constants/category";
import { STORAGE_TYPE_CONST } from "@/constants/storage";
import { RegisterIngredient } from "@/types/Ingredient";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";

interface IngredientItemProps {
  ingredient: RegisterIngredient;
  purchaseAt: string;
  onComplete: (data: {
    ingredientName: string;
    productPrice: number;
    categoryId: number;
    expirationDate: string;
    ingredientStorage: keyof typeof STORAGE_TYPE_CONST;
  }) => void;
  onDelete: () => void;
}

const MAX_PRODUCT_PRICE = 1000000;

const IngredientItem = ({
  ingredient,
  purchaseAt,
  onComplete,
  onDelete,
}: IngredientItemProps) => {
  const [ingredientData, setIngredientData] = useState(ingredient);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    const parsedValue =
      name === "productPrice" || name === "categoryId" ? Number(value) : value;

    if (name === "expirationDate") {
      const selectedExpirationDate = new Date(value);
      const purchaseDate = new Date(purchaseAt);

      if (selectedExpirationDate < purchaseDate) {
        alert("소비기한은 구매일 이후로 설정해야 합니다.");
        return;
      }
    }

    setIngredientData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  useEffect(() => {
    const {
      ingredientName,
      productPrice,
      categoryId,
      expirationDate,
      ingredientStorage,
    } = ingredientData;

    if (
      ingredientName.length > 0 &&
      productPrice >= 0 &&
      categoryId > 0 &&
      expirationDate &&
      ingredientStorage.length > 0
    ) {
      onComplete(ingredientData);
    }
  }, [ingredientData]);

  return (
    <div className="flex border-1 p-4 rounded-lg gap-5 w-full">
      <div className="flex justify-center items-center px-2">
        <button
          type="button"
          onClick={onDelete}
          className="flex items-center justify-center w-5 h-5 rounded-full text-negative-600 hover:negative-700 border-2 border-negative-600 text-xl font-semibold"
        >
          -
        </button>
      </div>
      <div className="flex flex-col w-full gap-2 min-w-0">
        <div className="flex gap-2 w-full justify-between items-center">
          <label
            className="w-20 cursor-pointer font-bold max-xs:text-sm"
            htmlFor="ingredientName"
          >
            상품명
          </label>
          <Input
            type="text"
            id="ingredientName"
            name="ingredientName"
            maxLength={30}
            className="border-1 h-8 w-full min-w-0 cursor-pointer text-right focus-visible:outline-2 focus-visible:outline-positive-300 p-1"
            value={ingredientData.ingredientName}
            onChange={handleChange}
          />
        </div>
        <div className="flex gap-2 w-full justify-between items-center">
          <label
            className="w-20 cursor-pointer font-bold max-xs:text-sm"
            htmlFor="categoryId"
          >
            분류
          </label>
          <select
            id="categoryId"
            name="categoryId"
            className="border-1 w-full min-w-0 cursor-pointer text-right focus:outline-positive-300 p-1"
            value={ingredientData.categoryId}
            onChange={handleChange}
          >
            {Object.values(CATEGORY_INFO).map((category) => (
              <option
                key={`${category.number} ${Math.random()}`}
                value={category.number}
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex relative gap-2 w-full justify-between items-center">
          <label
            className="w-20 cursor-pointer font-bold max-xs:text-sm"
            htmlFor="productPrice"
          >
            가격
          </label>
          <Input
            type="text"
            id="productPrice"
            name="productPrice"
            className="border-1 w-full h-8 min-w-0 cursor-pointer text-negative-500 font-bold text-right focus-visible:outline-2 focus-visible:outline-positive-300 p-1 pr-6 "
            onChange={(e) => {
              let value = e.target.value;
              if (value === "" || parseInt(value) < 0) {
                value = "0";
              }
              if (
                /^\d*\.?\d{0,0}$/.test(value) &&
                parseInt(value) <= MAX_PRODUCT_PRICE
              ) {
                handleChange(e);
              }
            }}
            value={ingredientData.productPrice}
            onFocus={(e) => e.target.select()}
          />
          <p className="absolute right-2 font-bold">원</p>
        </div>
        <div className="flex gap-2 w-full justify-between items-center">
          <label
            className="w-20 cursor-pointer font-bold max-xs:text-sm"
            htmlFor="expirationDate"
          >
            소비기한
          </label>
          <Input
            type="date"
            id="expirationDate"
            name="expirationDate"
            className="border-1 flex justify-end text-right h-8 w-full min-w-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-positive-300 p-1"
            onChange={handleChange}
            value={ingredientData.expirationDate}
          />
        </div>
        <div className="flex gap-2 w-full justify-between items-center">
          <label
            className="w-20 cursor-pointer font-bold max-xs:text-sm"
            htmlFor="ingredientStorage"
          >
            보관장소
          </label>
          <select
            id="ingredientStorage"
            name="ingredientStorage"
            className="border-1 w-full min-w-0 cursor-pointer text-right focus:outline-positive-300 p-1"
            value={ingredientData.ingredientStorage}
            onChange={handleChange}
          >
            {Object.keys(STORAGE_TYPE_CONST).map((key) => (
              <option key={key} value={key}>
                {STORAGE_TYPE_CONST[key as keyof typeof STORAGE_TYPE_CONST]}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default IngredientItem;
