import { ChangeEvent, useRef } from "react";
import DamulButton from "../common/DamulButton";
import PlusIcon from "../svg/PlusIcon";
import { postReceiptForOCR } from "@/service/home";
import { RegisterIngredientData } from "@/types/Ingredient";
import { CATEGORY_INFO_KR } from "@/constants/category";

interface OcrButtonProps {
  setIngredientRegisterData: React.Dispatch<
    React.SetStateAction<RegisterIngredientData>
  >;
}

interface responseData {
  ingredientName: string;
  category: keyof typeof CATEGORY_INFO_KR;
  productPrice: number;
  expiration_date: string;
  ingredientStorage: "FREEZER" | "FRIDGE" | "ROOMTEMP";
}

const OcrButton = ({ setIngredientRegisterData }: OcrButtonProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const fetchData = async (formData: FormData) => {
    try {
      const response = await postReceiptForOCR(formData);

      if (response.data.userIngredients.length > 0) {
        setIngredientRegisterData((prevData) => {
          const newIngredientRegisterData = { ...prevData };

          response.data.userIngredients.map((ingredient: responseData) => {
            newIngredientRegisterData.userIngredients.push({
              ingredientName: ingredient.ingredientName,
              categoryId: CATEGORY_INFO_KR[ingredient.category]
                ? CATEGORY_INFO_KR[ingredient.category].number
                : 10,
              productPrice: ingredient.productPrice,
              expirationDate: ingredient.expiration_date,
              ingredientStorage:
                ingredient.ingredientStorage === "ROOMTEMP"
                  ? "ROOM_TEMPERATURE"
                  : ingredient.ingredientStorage,
            });
          });

          newIngredientRegisterData.purchaseAt = response.data.purchaseAt;
          newIngredientRegisterData.storeName = response.data.storeName;

          return newIngredientRegisterData;
        });
      }
    } catch (error: any) {
      console.log("영수증 입력이 실패하였습니다.");
      alert("영수증 등록에 실패하였습니다.");
    }
  };

  const onChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFormData = new FormData();
      newFormData.append("image", e.target.files[0]);
      fetchData(newFormData);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        multiple={false}
        ref={inputRef}
        onChange={onChangeFile}
      />
      <DamulButton
        onClick={handleClick}
        className="bg-white items-center justify-end text-normal-300 text-sm gap-1"
      >
        <PlusIcon className="w-6 h-full text-normal-300 fill-normal-200 stroke-2 stroke-normal-200" />
        <p>영수증으로 입력하기</p>
      </DamulButton>
    </>
  );
};

export default OcrButton;
