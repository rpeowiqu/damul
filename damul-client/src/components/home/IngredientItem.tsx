import { CATEGORYNUMBER, CATEGORYNAME } from "@/constants/category";
import { STORAGE_TYPE_MAP, STORAGE_TYPE_CONST } from "@/constants/storage";

interface IngredientItemProps {
  ingredient?: {
    ingredientName: string;
    productPrice: number;
    categoryId: number;
    dueDate: string;
    ingredientStorage: keyof typeof STORAGE_TYPE_CONST;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void;
}

const IngredientItem = ({
  ingredient,
  onChange,
  onDelete,
}: IngredientItemProps) => {
  return (
    <div className="flex w-full border-1 p-4 rounded-lg gap-5">
      <div className="flex justify-center items-center px-2">
        <button
          type="button"
          onClick={onDelete}
          className="flex items-center justify-center w-5 h-5 rounded-full text-negative-600 hover:negative-700 border-2 border-negative-600 text-xl font-semibold"
        >
          -
        </button>
      </div>
      <div className="flex flex-col w-full gap-2">
        <div className="flex gap-2 w-full justify-between">
          <label className="w-20">상품명</label>
          <input
            type="text"
            className="border-1 w-full text-right focus:outline-positive-300"
            value={ingredient && ingredient.ingredientName}
            onChange={onChange}
          />
        </div>
        <div className="flex gap-2 w-full justify-between">
          <label className="w-20">분류</label>
          <input
            type="text"
            className="border-1 w-full text-right focus:outline-positive-300"
            onChange={onChange}
            value={
              ingredient && CATEGORYNAME[CATEGORYNUMBER[ingredient.categoryId]]
            }
          />
        </div>
        <div className="flex gap-2 w-full justify-between">
          <label className="w-20">가격</label>
          <input
            type="text"
            className="border-1 w-full text-right focus:outline-positive-300"
            onChange={onChange}
            value={ingredient && ingredient.productPrice}
          />
        </div>
        <div className="flex gap-2 w-full justify-between">
          <label className="w-20">소비기한</label>
          <input
            type="text"
            className="border-1 w-full  text-right focus:outline-positive-300"
            onChange={onChange}
            value={ingredient && ingredient.dueDate}
          />
        </div>
        <div className="flex gap-2 w-full justify-between">
          <label className="w-20">보관장소</label>
          <input
            type="text"
            className="border-1 w-full text-right focus:outline-positive-300"
            onChange={onChange}
            value={
              ingredient && STORAGE_TYPE_CONST[ingredient.ingredientStorage]
            }
          />
        </div>
      </div>
    </div>
  );
};

export default IngredientItem;
