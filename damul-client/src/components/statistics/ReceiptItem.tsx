import { ReceiptDetail } from "@/types/statistics";
import { CATEGORY_ICON_MAPPER } from "@/constants/category";

const ReceiptItem = ({ productName, categoryName, price }: ReceiptDetail) => {
  return (
    <div className="flex justify-between items-center gap-3 p-2 border-b border-normal-100 hover:bg-normal-50">
      {CATEGORY_ICON_MAPPER[categoryName]({ className: "size-8" })}
      <p className="flex-1 w-32 truncate font-bold">{productName} (1kg)</p>
      <p className="text-xs xs:text-sm text-normal-200">{categoryName}</p>
      <p className="font-black">{price.toLocaleString()}원</p>
    </div>
  );
};

export default ReceiptItem;
