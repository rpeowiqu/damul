import DamulButton from "@/components/common/DamulButton";
import DamulHoverCard from "@/components/common/DamulHoverCard";
import IngredientItem from "@/components/home/IngredientItem";
import OcrButton from "@/components/home/OcrButton";
import AlertCircleIcon from "@/components/svg/AlertCircleIcon";
import PlusIcon from "@/components/svg/PlusIcon";
import ResetIcon from "@/components/svg/ResetIcon";
import { Input } from "@/components/ui/input";
import { initialRegisterIngredient } from "@/constants/initialData";
import { postUserIndegredient } from "@/service/home";
import { RegisterIngredient } from "@/types/Ingredient";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LIMIT_ADD_COUNT = 50;

const HomeIngredientsRegisterPage = () => {
  const [ingredientRegisterData, setIngredientRegisterData] = useState<
    RegisterIngredient[]
  >([initialRegisterIngredient]);

  const [storeName, setStoreName] = useState("");
  const [purchaseAt, setPurchaseAt] = useState("");

  const [totalAmount, setTotalAmount] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleResetData = () => {
    setStoreName("");
    setPurchaseAt("");

    setIngredientRegisterData([
      { ...initialRegisterIngredient, id: Math.floor(Math.random() * 100000) },
    ]);
  };

  const handleStoreNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStoreName(e.target.value);
  };
  const handlePurchaseAtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(e.target.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      alert("오늘 날짜를 포함한 이전 날짜만 선택 가능합니다.");
      return;
    }

    setPurchaseAt(e.target.value);
  };

  const handleIngredientComplete = (
    index: number,
    data: RegisterIngredient,
  ) => {
    setIngredientRegisterData((prev) =>
      prev.map((item, i) => (i === index ? { ...data } : item)),
    );
  };

  const addIngredient = () => {
    if (ingredientRegisterData.length <= LIMIT_ADD_COUNT) {
      setIngredientRegisterData((prev) => [
        ...prev,
        {
          id: Math.floor(Math.random() * 1000000),
          ingredientName: "",
          productPrice: 0,
          categoryId: 1,
          expirationDate: "",
          ingredientStorage: "FRIDGE",
        },
      ]);
    } else {
      alert(
        "효과적인 식자재 등록을 위해 식자재 등록 후 이용해주시길 바랍니다.",
      );
    }
  };

  const removeIngredient = (index: number) => {
    setIngredientRegisterData((prev) => {
      const updatedIngredients = prev.filter((_, idx) => idx !== index);

      if (prev.length === 1) {
        return ingredientRegisterData;
      }

      return updatedIngredients;
    });
  };

  useEffect(() => {
    const newTotal = ingredientRegisterData.reduce(
      (sum, item) => sum + (Number(item.productPrice) || 0),
      0,
    );
    setTotalAmount(newTotal);
  }, [ingredientRegisterData]);

  const handleRegisterIngredients = async () => {
    setIsLoading(true);
    const data = {
      storeName,
      purchaseAt,
      userIngredients: ingredientRegisterData.map(({ id, ...rest }) => rest),
    };

    try {
      await postUserIndegredient(data);
      navigate("/home");
    } catch (error: any) {
      console.log("식자재를 등록하지 못했습니다.");
      alert("식자재를 등록하지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col p-5">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999999999]">
          <div className="bg-white p-5 rounded-lg shadow-lg">
            <p className="text-xl font-bold">처리 중...</p>
          </div>
        </div>
      )}

      <div className="flex w-full gap-6 items-center text-xl font-bold">
        <button type="button" onClick={() => navigate("/home")}>
          {"<"}
        </button>
        <p>식자재 등록하기</p>
      </div>
      <p className="text-positive-300 font-bold p-1">
        오늘은 이런 품목을 구매하셨네요!
      </p>
      <div className="flex justify-between pt-2">
        <DamulButton
          onClick={handleResetData}
          className="flex bg-white items-center border justify-end text-normal-300 text-sm gap-1 hover:bg-normal-200/50 transition ease-in-out duration-150 active:scale-75"
        >
          <ResetIcon className="stroke-2 stroke-normal-200" />
          <p>초기화</p>
        </DamulButton>
        <div className="flex justify-center items-center gap-1">
          <DamulHoverCard
            hoverCardTrigger={
              <AlertCircleIcon className="size-5 stroke-normal-200" />
            }
          >
            <div className="text-sm">
              영수증 이미지는 최대 5MB까지 이용가능합니다.
            </div>
          </DamulHoverCard>
          <OcrButton
            setStoreName={setStoreName}
            setPurchaseAt={setPurchaseAt}
            setIngredientRegisterData={setIngredientRegisterData}
            setIsLoading={setIsLoading}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-5 justify-center">
        <div className="flex w-full gap-2">
          <div className="w-full flex flex-col gap-2">
            <label className="cursor-pointer font-bold" htmlFor="storeName">
              매장명
            </label>
            <Input
              name="storeName"
              id="storeName"
              type="text"
              maxLength={20}
              value={storeName}
              onChange={handleStoreNameChange}
              className="border h-8 w-full min-w-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-positive-300 p-1"
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <label className="cursor-pointer font-bold" htmlFor="purchaseAt">
              날짜
            </label>
            <Input
              name="purchaseAt"
              type="date"
              value={purchaseAt}
              onChange={handlePurchaseAtChange}
              className="border h-8 w-full min-w-0 justify-end text-right cursor-pointer focus-visible:outline-2 focus-visible:outline-positive-300 p-1"
            />
          </div>
        </div>
        <div className="flex flex-col gap-4 h-60 overflow-y-auto">
          {ingredientRegisterData.map((ingredient, index) => (
            <IngredientItem
              key={ingredient.id}
              ingredient={ingredient}
              purchaseAt={purchaseAt}
              onComplete={(data) => handleIngredientComplete(index, data)}
              onDelete={() => removeIngredient(index)}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-between px-6 pb-6">
        <button
          type="button"
          className="active:bg-positive-200 w-6 h-6 rounded-full transition ease-in-out duration-150 active:scale-90"
          onClick={addIngredient}
        >
          <PlusIcon className="w-full fill-positive-300" />
        </button>

        <div className="flex justify-end items-center gap-2 font-bold">
          총 구매 금액:
          <span className="text-negative-500">
            {totalAmount.toLocaleString()}
          </span>
          원
        </div>
      </div>

      <DamulButton
        onClick={handleRegisterIngredients}
        className="bg-positive-300 w-full hover:bg-positive-300/60 px-4 py-2 text-white font-semibold rounded-lg shadow-md transition ease-in-out duration-150 active:scale-90"
      >
        등록
      </DamulButton>
    </div>
  );
};

export default HomeIngredientsRegisterPage;
