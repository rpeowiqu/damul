import SubmitButton from "@/components/community/SubmitButton";
import IngredientItem from "@/components/home/IngredientItem";
import PlusIcon from "@/components/svg/PlusIcon";

const HomeIngredientsRegisterPage = () => {
  return (
    <div className="flex flex-col p-5">
      <div className="flex w-full gap-6 items-center text-xl font-bold">
        <button type="button">{"<"}</button>
        <p>식자재 등록하기</p>
      </div>
      <p className="p-4 text-positive-300 font-bold">
        오늘은 이런 품목을 구매하셨네요!
      </p>
      <button className="flex items-center justify-end text-normal-300 text-sm gap-1">
        <PlusIcon className="text-normal-300 w-4 fill-normal-200 stroke-2 stroke-normal-200" />
        <p>영수증으로 입력하기</p>
      </button>

      <div className="my-4 flex flex-col gap-4">
        <div className="flex w-full justify-between">
          <div>
            <p>매장명</p>
            <input type="text" className="border-1" />
          </div>
          <div>
            <p>날짜</p>
            <input type="date" className="border-1" />
          </div>
        </div>
        <div className="flex flex-col gap-4 h-[200px] overflow-y-auto">
          {Array.from({ length: 3 }).map((_, index) => {
            return <IngredientItem key={index} />;
          })}
        </div>
      </div>
      <div className="flex justify-end gap-2 font-bold">
        총 구매 금액: <span className="text-positive-300">25,400</span>원
      </div>
      <button className="flex justify-center text-normal-300 text-sm gap-1">
        <PlusIcon className="w-20 stroke-positive-400 fill-positive-400" />
      </button>
      <SubmitButton></SubmitButton>
    </div>
  );
};

export default HomeIngredientsRegisterPage;
