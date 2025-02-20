import { ChangeEvent, useRef } from "react";
import DamulButton from "../common/DamulButton";
import { postReceiptForOCR } from "@/service/home";
import { RegisterIngredient } from "@/types/Ingredient";
import { CATEGORY_ID_MAPPER } from "@/constants/category";
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
  category: keyof typeof CATEGORY_ID_MAPPER;
  productPrice: number;
  expiration_date: string;
  ingredientStorage: "FREEZER" | "FRIDGE" | "ROOMTEMP";
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;

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
          const newIngredientRegisterData =
            prevData[0].ingredientName.length > 0 ? [...prevData] : [];

          response.data.userIngredients.map((ingredient: responseData) => {
            newIngredientRegisterData.push({
              id: Math.floor(Math.random() * 10000),
              ingredientName: ingredient.ingredientName,
              categoryId: CATEGORY_ID_MAPPER[ingredient.category]
                ? CATEGORY_ID_MAPPER[ingredient.category]
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
      const file = e.target.files[0];

      if (file.size > MAX_FILE_SIZE) {
        alert("파일 크기는 10MB 이하로 업로드해 주세요.");
        if (inputRef.current) {
          inputRef.current.value = "";
        }
        return;
      }

      const newFormData = new FormData();
      newFormData.append("image", file);
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
        className="bg-positive-300 items-center border justify-end text-white text-sm gap-1 hover:bg-normal-200/50 transition ease-in-out duration-150 active:scale-75"
      >
        <ReceiptIcon className="w-6 h-full fill-white stroke-2 stroke-normal-200" />
        <p>영수증으로 입력하기</p>
      </DamulButton>
    </>
  );
};

export default OcrButton;
