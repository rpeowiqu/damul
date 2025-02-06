import { useEffect, useState } from "react";
import IngredientButton from "./IngredientButton";
import { CATEGORYNUMBER } from "@/constants/category";
import { STORAGE_ICON, STORAGE_TYPE } from "@/constants/storage";

interface StoredItemsCategoriesProps {
  title: keyof typeof STORAGE_TYPE;
  items: {
    userIngredientId: number;
    categoryId: number;
    ingredientName: string;
    ingredientQuantity: number;
  }[];
}

const COLUMN_SIZE = {
  pc: 5,
  sm: 4,
  xs: 3,
  default: 2,
};

const StoredItemsCategories = ({
  title,
  items,
}: StoredItemsCategoriesProps) => {
  const IconComponent = STORAGE_ICON[title];

  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverColumnLimit, setIsOverColumnLimit] = useState(false);

  const handleOnClick = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 600) {
        setIsOverColumnLimit(items.length > COLUMN_SIZE.pc);
      } else if (window.innerWidth >= 480) {
        setIsOverColumnLimit(items.length > COLUMN_SIZE.sm);
      } else if (window.innerWidth >= 360) {
        setIsOverColumnLimit(items.length > COLUMN_SIZE.xs);
      } else {
        setIsOverColumnLimit(false);
      }
      setIsExpanded(false);
    };

    window.addEventListener("load", handleResize);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("load", handleResize);
      window.removeEventListener("resize", handleResize);
    };
  }, [items]);

  return (
    <div className="pt-[10px] my-3 border border-normal-100 rounded-xl min-h-[100px]">
      <div className="flex items-center gap-1 px-2 text-sm">
        <IconComponent />
        <p className="font-bold">{STORAGE_TYPE[title]}</p>
      </div>
      <div
        className={`grid grid-cols-2 gap-2 p-2 mt-2 mb-3 pc:grid-cols-5 sm:grid-cols-4 xs:grid-cols-3 ${!isExpanded && "overflow-y-hidden h-20"}`}
      >
        {items.map((item, idx) => (
          <IngredientButton
            key={idx}
            variant={CATEGORYNUMBER[item.categoryId]}
            name={item.ingredientName}
          />
        ))}
      </div>

      <button
        onClick={handleOnClick}
        className={`${isOverColumnLimit ? "block" : "hidden"}
      flex items-center justify-center w-full h-full p-4 mt-2 bg-normal-100/50 rounded-b-xl`}
      >
        {isExpanded ? (
          <div className="h-2 leading-3 text-xs text-normal-300">접기</div>
        ) : (
          <div className={"w-20 h-1 bg-normal-200/50"}></div>
        )}
      </button>
    </div>
  );
};

export default StoredItemsCategories;
