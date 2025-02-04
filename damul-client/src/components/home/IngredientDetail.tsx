import { MeatIcon } from "../svg";
import DeleteIcon from "../svg/DeleteIcon";
import SaveIcon from "../svg/SaveIcon";
import { Slider } from "../ui/slider";

const IngredientDetail = () => {
  return (
    <div className="flex flex-col items-center px-[10px] border-4 border-normal-50 rounded-xl w-96">
      <p className="w-full py-4 text-xl font-bold text-center border-b-2 text-positive-300 border-b-normal-50">
        식자재 상세보기
      </p>
      <div className="flex items-center justify-center w-full p-6">
        <div className="flex items-center justify-center w-full border-2 rounded-full border-normal-50 h-24 w-24">
          <MeatIcon className="scale-[3]" />
        </div>

        <div className="flex flex-col items-center justify-center w-full gap-3">
          <div className="flex flex-col">
            <p className="font-bold text-positive-300">식자재명</p>
            <p className="text-lg font-bold">삼겹살(600g)</p>
          </div>
          <div className="flex flex-col">
            <p className="font-bold text-positive-300">구매일</p>
            <p className="text-lg font-bold">2025-02-04</p>
          </div>
          <div className="flex flex-col">
            <p className="font-bold text-positive-300">소비기한</p>
            <p className="text-lg font-bold">2025-03-16</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full gap-1">
        <div className="flex justify-between">
          <p className="text-sm text-positive-300">다 썼어요</p>
          <p className="text-sm text-positive-300">넉넉해요!</p>
        </div>
        <div className="flex justify-center">
          <Slider
            className="w-72"
            onValueChange={(i) => console.log(i)}
            defaultValue={[33]}
            max={100}
            step={1}
          />
        </div>
        <p className="flex items-center justify-center w-full gap-1 text-sm">
          <span className="text-lg font-bold">80%</span> 남았어요
        </p>
      </div>
      <div className="flex justify-between w-full py-6">
        <button className="flex items-center justify-center w-[170px] gap-2 py-2 rounded-lg bg-positive-300">
          <DeleteIcon />
          <p className="text-sm text-white">즉시 제거하기</p>
        </button>
        <button className="flex items-center justify-center w-[170px] gap-2 py-2 rounded-lg bg-positive-300 px-7">
          <SaveIcon />
          <p className="text-sm text-white">저장하기</p>
        </button>
      </div>
    </div>
  );
};

export default IngredientDetail;
