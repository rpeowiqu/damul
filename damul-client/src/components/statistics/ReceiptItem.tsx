import { FruitIcon } from "../svg";

const ReceiptItem = () => {
  return (
    <div className="flex justify-between items-center gap-3 p-2 border-b border-normal-100 hover:bg-positive-50">
      <FruitIcon className="size-8" />
      <p className="flex-1 max-w-32 truncate font-bold">사과(1kg)</p>
      <p className="text-xs xs:text-sm text-normal-200">과일</p>
      <p className="font-black">18,000원</p>
    </div>
  );
};

export default ReceiptItem;
