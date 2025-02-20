import DamulButton from "@/components/common/DamulButton";
import DamulHoverCard from "@/components/common/DamulHoverCard";
import IngredientItem from "@/components/home/IngredientItem";
import OcrButton from "@/components/home/OcrButton";
import QrCodeBox from "@/components/home/QrCodeBox";
import AlertCircleIcon from "@/components/svg/AlertCircleIcon";
import PlusIcon from "@/components/svg/PlusIcon";
import ResetIcon from "@/components/svg/ResetIcon";
import { Input } from "@/components/ui/input";
import { CATEGORY_ID_MAPPER } from "@/constants/category";
import { initialRegisterIngredient } from "@/constants/initialData";
import useAuth from "@/hooks/useAuth";
import { postUserIndegredient } from "@/service/home";
import { RegisterIngredient } from "@/types/Ingredient";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "@/components/common/Loading";

interface responseData {
  ingredientName: string;
  category: keyof typeof CATEGORY_ID_MAPPER;
  productPrice: number;
  expiration_date: string;
  ingredientStorage: "FREEZER" | "FRIDGE" | "ROOMTEMP";
}

const LIMIT_ADD_COUNT = 50;
const API_URL = import.meta.env.VITE_API_BASE_URL;
const MAX_RETRY_ATTEMPTS = 5;
const INITIAL_RETRY_DELAY = 5000;

const HomeIngredientsRegisterPage = () => {
  const [ingredientRegisterData, setIngredientRegisterData] = useState<
    RegisterIngredient[]
  >([initialRegisterIngredient]);

  const { data } = useAuth();

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

  useEffect(() => {
    if (!data?.data?.id) return;

    let eventSource: EventSource | null = null;
    let retryAttempt = 0;
    let retryTimeout: NodeJS.Timeout;

    const connectSSE = () => {
      eventSource = new EventSource(`${API_URL}sse/connect/${data.data.id}`, {
        withCredentials: true,
      });

      eventSource.onopen = () => {
        console.log("✅ SSE 연결이 성공적으로 열렸습니다.");
        retryAttempt = 0;
      };

      eventSource.addEventListener("image", (event) => {
        try {
          const response = JSON.parse(event.data);

          if (response.type === "PROCESSING_STARTED") {
            console.log("🔄 이미지 분석이 시작됨");
            setIsLoading(true);
          }

          if (response.type === "PROCESSING_COMPLETED") {
            console.log("✅ 이미지 분석 완료");
          }

          if (response.type === "PROCESSING_COMPLETED") {
            const updatedData = response.data.data;
            if (updatedData.length > 0) {
              setIngredientRegisterData((prevData) => {
                const newIngredientRegisterData =
                  prevData[0].ingredientName.length > 0 ? [...prevData] : [];

                updatedData.map((ingredient: responseData) => {
                  newIngredientRegisterData.push({
                    id: Math.floor(Math.random() * 10000),
                    ingredientName: ingredient.ingredientName,
                    categoryId: CATEGORY_ID_MAPPER[ingredient.category] || 10,
                    productPrice: ingredient.productPrice,
                    expirationDate: ingredient.expiration_date,
                    ingredientStorage:
                      ingredient.ingredientStorage === "ROOMTEMP"
                        ? "ROOM_TEMPERATURE"
                        : ingredient.ingredientStorage,
                  });
                });

                return newIngredientRegisterData;
              });
            }
            setIsLoading(false);
          }
        } catch (error) {
          console.error("데이터 처리 중 오류가 발생했습니다.", error);
        }
      });

      eventSource.onerror = (error) => {
        console.error("❌ SSE 연결 오류 발생", error);
        eventSource?.close();

        if (retryAttempt < MAX_RETRY_ATTEMPTS) {
          const retryDelay = INITIAL_RETRY_DELAY * Math.pow(2, retryAttempt);
          retryTimeout = setTimeout(connectSSE, retryDelay);
          retryAttempt += 1;
          console.log(
            `⏳ ${retryDelay / 1000}초 후 SSE 재연결 시도... (시도 ${retryAttempt}/${MAX_RETRY_ATTEMPTS})`,
          );
        } else {
          console.warn("🚨 최대 재시도 횟수를 초과하여 SSE 재연결 중단");
        }
      };
    };

    connectSSE();

    return () => {
      eventSource?.close();
      clearTimeout(retryTimeout);
    };
  }, [data]);

  return (
    <div className="flex flex-col p-5 relative">
      {isLoading && (
        <Loading
          message={`영수증 등록 중 입니다. 잠시만 기다려주세요`}
          purpose="OCR"
        />
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
          className="flex bg-positive-300 items-center border justify-end text-white text-sm gap-1 hover:bg-normal-200/50 transition ease-in-out duration-150 active:scale-75"
        >
          <ResetIcon className="stroke-2 stroke-white" />
          <p>초기화</p>
        </DamulButton>
        <div className="flex justify-center items-center gap-1">
          <DamulHoverCard
            hoverCardTrigger={
              <AlertCircleIcon className="size-5 stroke-normal-200" />
            }
          >
            <div className="text-sm">
              영수증 이미지는 최대 10MB까지 이용가능합니다.
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

      <div className="flex justify-between px-6 pb-5 pt-2">
        <button
          type="button"
          className="active:bg-positive-200 w-6 h-6 rounded-full transition ease-in-out duration-150 active:scale-90"
          onClick={addIngredient}
        >
          <PlusIcon className="w-full fill-blue-500" />
        </button>

        <div className="flex justify-end items-center font-bold">
          총 구매 금액 :
          <span className="text-negative-500 px-1">
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

      <QrCodeBox />
    </div>
  );
};

export default HomeIngredientsRegisterPage;
