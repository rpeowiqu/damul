import { useEffect, useState } from "react";
import IngredientsButton from "./IngredientsButton";
import { CATEGORYNUMBER } from "@/constants/category";
import { STORAGE_ICON, STORAGE_TYPE } from "@/constants/storage";

const ROW_SIZE = {
  pc: 5,
  sm: 4,
  xs: 3,
  default: 2,
};

interface StoredItemsCategoriesProps {
  title: keyof typeof STORAGE_TYPE;
  items: {
    userIngredientId: number;
    categoryId: number;
    ingredientName: string;
    ingredientQuantity: number;
    ingredientStorage: string;
  }[];
}

const StoredItemsCategories = ({
  title,
  items,
}: StoredItemsCategoriesProps) => {
  const IconComponent = STORAGE_ICON[title];

  const [visibleRows, setVisibleRows] = useState(1);
  const [columns, setColumns] = useState(ROW_SIZE.default);

  useEffect(() => {
    const updateColumns = () => {
      if (typeof window !== "undefined") {
        if (window.innerWidth >= 600) {
          setColumns(ROW_SIZE.pc);
        } else if (window.innerWidth >= 480) {
          setColumns(ROW_SIZE.sm);
        } else if (window.innerWidth >= 360) {
          setColumns(ROW_SIZE.xs);
        } else {
          setColumns(ROW_SIZE.default);
        }
      }
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  useEffect(() => {
    setVisibleRows(1);
  }, [columns]);

  const visibleItems = items.slice(0, visibleRows * columns);
  const isExpanded = visibleItems.length >= items.length;

  return (
    <div className="pt-[10px] my-3 border border-normal-100 rounded-xl min-h-[100px]">
      <div className="flex items-center gap-1 px-2 text-sm">
        <IconComponent />
        <p>{STORAGE_TYPE[title]}</p>
      </div>
      <div className="grid grid-cols-2 gap-2 p-2 mt-2 mb-3 pc:grid-cols-5 sm:grid-cols-4 xs:grid-cols-3">
        {visibleItems.map((item, idx) => (
          <IngredientsButton
            key={idx}
            variant={CATEGORYNUMBER[item.categoryId]}
            name={item.ingredientName}
          />
        ))}
      </div>

      <button
        onClick={() => setVisibleRows(isExpanded ? 1 : visibleRows + 1)}
        className={`${isExpanded && visibleRows === 1 ? "hidden" : "block"}
      flex items-center justify-center w-full h-full p-4 mt-2 bg-normal-100/50 rounded-b-xl`}
      >
        {isExpanded ? (
          <div className="h-4 text-xs text-normal-300">접기</div>
        ) : (
          <div className={"w-20 h-1 bg-normal-200/50"}></div>
        )}
      </button>
    </div>
  );
};

export default StoredItemsCategories;
