import { CATEGORYNAME } from "@/constants/category";
import { STORAGE_TYPE_CONST } from "@/constants/storage";

interface IngredientItemProps {
  ingredient: {
    ingredientName: string;
    productPrice: number;
    categoryId: number;
    expirationDate: string;
    ingredientStorage: keyof typeof STORAGE_TYPE_CONST;
  };
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index?: number,
    field?: string,
  ) => void;
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
          <label className="w-20 cursor-pointer" htmlFor="ingredientName">
            상품명
          </label>
          <input
            type="text"
            id="ingredientName"
            name="ingredientName"
            className="border-1 w-full cursor-pointer text-right focus:outline-positive-300 p-1"
            value={ingredient.ingredientName}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className="flex gap-2 w-full justify-between">
          <label className="w-20 cursor-pointer" htmlFor="categoryId">
            분류
          </label>
          <select
            id="categoryId"
            name="categoryId"
            className="border-1 w-full cursor-pointer text-right focus:outline-positive-300 p-1"
            value={ingredient.categoryId}
            onChange={(e) => onChange(e)}
          >
            {Object.keys(CATEGORYNAME).map((key, idx) => (
              <option key={key} value={idx + 1}>
                {CATEGORYNAME[key as keyof typeof CATEGORYNAME]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 w-full justify-between">
          <label className="w-20 cursor-pointer" htmlFor="productPrice">
            가격
          </label>
          <input
            type="text"
            id="productPrice"
            name="productPrice"
            className="border-1 w-full cursor-pointer text-right focus:outline-positive-300 p-1"
            onChange={(e) => onChange(e)}
            value={ingredient.productPrice}
            onFocus={(e) => e.target.select()}
          />
        </div>
        <div className="flex gap-2 w-full justify-between">
          <label className="w-20 cursor-pointer" htmlFor="expirationDate">
            소비기한
          </label>
          <input
            type="date"
            id="expirationDate"
            name="expirationDate"
            className="border-1 w-full cursor-pointer text-right focus:outline-positive-300 p-1"
            onChange={(e) => onChange(e)}
            value={ingredient.expirationDate}
          />
        </div>
        <div className="flex gap-2 w-full justify-between">
          <label className="w-20 cursor-pointer" htmlFor="ingredientStorage">
            보관장소
          </label>
          <select
            id="ingredientStorage"
            name="ingredientStorage"
            className="border-1 w-full cursor-pointer text-right focus:outline-positive-300 p-1"
            value={ingredient.ingredientStorage}
            onChange={(e) => onChange(e)}
          >
            {Object.keys(STORAGE_TYPE_CONST).map((key) => (
              <option key={key} value={key}>
                {STORAGE_TYPE_CONST[key as keyof typeof STORAGE_TYPE_CONST]}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default IngredientItem;
