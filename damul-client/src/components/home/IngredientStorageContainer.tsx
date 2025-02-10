import { useEffect, useState } from "react";
import IngredientButton from "./IngredientButton";
import { CATEGORYNUMBER } from "@/constants/category";
import { STORAGE_ICON, STORAGE_TYPE } from "@/constants/storage";
import { ITEM_STATUS, ITEM_STATUS_ICON } from "@/constants/itemStatus";
import { Ingredient } from "@/types/Ingredient";
import DamulModal from "../common/DamulModal";
import IngredientDetail from "./IngredientDetail";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { useIngredientStore } from "@/stores/ingredientStore";

interface IngredientStorageContainerProps {
  title: keyof typeof STORAGE_TYPE | keyof typeof ITEM_STATUS;
  items: Ingredient[];
  onEdit: boolean;
}

const COLUMN_SIZE = {
  pc: 5,
  sm: 4,
  xs: 3,
  default: 2,
};

const initialData = {
  userIngredientId: 11111,
  categoryId: 2,
  ingredientName: "사과",
  ingredientQuantity: 50,
  expirationDate: 30,
  storage: "roomTemp",
  purchaseDate: "2025-02-10",
};

const IngredientStorageContainer = ({
  title,
  items,
  onEdit,
}: IngredientStorageContainerProps) => {
  const IconComponent =
    title === "expiringSoon" ? ITEM_STATUS_ICON[title] : STORAGE_ICON[title];

  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverColumnLimit, setIsOverColumnLimit] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] =
    useState<Ingredient>(initialData);

  const { setSelectedIngredients } = useIngredientStore();

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleOnClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleOnIngredientBtn = (ingredient: Ingredient) => {
    if (onEdit) {
      setSelectedIngredients(ingredient);
    } else {
      setSelectedIngredient(ingredient);
      setIsOpen(true);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const filteredItems = items.filter(
        (item) => !(item.expirationDate < 0 && title === "expiringSoon"),
      );

      let columns = COLUMN_SIZE.default;
      if (window.innerWidth >= 600) columns = COLUMN_SIZE.pc;
      else if (window.innerWidth >= 480) columns = COLUMN_SIZE.sm;
      else if (window.innerWidth >= 360) columns = COLUMN_SIZE.xs;

      setIsOverColumnLimit(filteredItems.length > columns);
      setIsExpanded(false);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="pt-[10px] my-3 border border-normal-100 rounded-xl min-h-[100px]">
      <div className="flex items-center gap-1 px-2 text-sm">
        <IconComponent />
        <p
          className={`font-bold ${title === "expiringSoon" && "text-negative-500"}`}
        >
          {title === "expiringSoon" ? ITEM_STATUS[title] : STORAGE_TYPE[title]}
        </p>
      </div>
      <div
        className={`grid grid-cols-2 gap-2 p-2 mt-2 mb-3 pc:grid-cols-5 sm:grid-cols-4 xs:grid-cols-3 ${!isExpanded && "overflow-y-hidden h-[70px]"}`}
      >
        {items.map((item, idx) => {
          if (item.expirationDate < 0 && title === "expiringSoon") {
            return null;
          }

          return (
            <IngredientButton
              key={idx}
              variant={CATEGORYNUMBER[item.categoryId]}
              name={item.ingredientName}
              quantity={item.ingredientQuantity}
              expirationDate={item.expirationDate}
              onClick={() => handleOnIngredientBtn(item)}
              onEdit={onEdit}
              id={item.userIngredientId}
            />
          );
        })}
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

      <DamulModal
        isOpen={isOpen}
        onOpenChange={() => {
          setIsOpen(false);
        }}
      >
        {selectedIngredient && (
          <IngredientDetail
            ingredient={selectedIngredient}
            setIsDeleteOpen={setIsDeleteOpen}
            setIsOpen={setIsOpen}
          />
        )}
      </DamulModal>

      <DamulModal
        isOpen={isDeleteOpen}
        onOpenChange={() => setIsDeleteOpen(false)}
      >
        {selectedIngredient && (
          <ConfirmDeleteModal
            setIsDeleteOpen={setIsDeleteOpen}
            setIsOpen={setIsOpen}
          />
        )}
      </DamulModal>
    </div>
  );
};

export default IngredientStorageContainer;
