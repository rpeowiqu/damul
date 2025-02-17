import { ChangeEvent, useRef } from "react";
import DamulButton from "../common/DamulButton";
import { postReceiptForOCR } from "@/service/home";
import { RegisterIngredient } from "@/types/Ingredient";
import { CATEGORY_INFO_KR } from "@/constants/category";
import ReceiptIcon from "../svg/ReceiptIcon";

interface OcrButtonProps {
  setStoreName: React.Dispatch<React.SetStateAction<string>>;
  setPurchaseAt: React.Dispatch<React.SetStateAction<string>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIngredientRegisterData: React.Dispatch<
    React.SetStateAction<RegisterIngredient[]>
  >;
}

interface responseData {
  ingredientName: string;
  category: keyof typeof CATEGORY_INFO_KR;
  productPrice: number;
  expiration_date: string;
  ingredientStorage: "FREEZER" | "FRIDGE" | "ROOMTEMP";
}

const OcrButton = ({
  setStoreName,
  setPurchaseAt,
  setIsLoading,
  setIngredientRegisterData,
}: OcrButtonProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const fetchData = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const response = await postReceiptForOCR(formData);

      if (response.data.userIngredients.length > 0) {
        setIngredientRegisterData((prevData) => {
          const newIngredientRegisterData = [...prevData];

          response.data.userIngredients.map((ingredient: responseData) => {
            newIngredientRegisterData.push({
              id: Math.floor(Math.random() * 10000),
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

          setPurchaseAt(response.data.purchaseAt);
          setStoreName(response.data.storeName);

          return newIngredientRegisterData;
        });
      }
    } catch (error: any) {
      console.log("영수증 입력이 실패하였습니다.");
      alert("영수증 등록에 실패하였습니다.");
    } finally {
      setIsLoading(false);
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
        className="bg-white items-center justify-end text-normal-300 text-sm gap-1 hover:bg-normal-200/50 shadow-md transition ease-in-out duration-150 active:scale-75"
      >
        <ReceiptIcon className="w-6 h-full text-normal-300 fill-normal-200 stroke-2 stroke-normal-200" />
        <p>영수증으로 입력하기</p>
      </DamulButton>
    </>
  );
};

export default OcrButton;
