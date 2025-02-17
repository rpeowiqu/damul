import { useEffect, useState } from "react";
import IngredientButton from "./IngredientButton";
import { STORAGE_ICON, STORAGE_TYPE } from "@/constants/storage";
import {
  EXPIRINGSOON_DAY,
  ITEM_STATUS,
  ITEM_STATUS_ICON,
} from "@/constants/itemStatus";
import { Ingredient, IngredientData } from "@/types/Ingredient";
import DamulModal from "../common/DamulModal";
import IngredientDetail from "./IngredientDetail";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { useIngredientStore } from "@/stores/ingredientStore";
import { initialIngrdientItem } from "@/constants/initialData";

interface IngredientStorageContainerProps {
  title: keyof typeof STORAGE_TYPE | keyof typeof ITEM_STATUS;
  items: Ingredient[];
  onEdit?: boolean;
  setExpiringSoonItems?: React.Dispatch<React.SetStateAction<Ingredient[]>>;
  setIngredientData?: React.Dispatch<React.SetStateAction<IngredientData>>;
}

const COLUMN_SIZE = {
  pc: 5,
  sm: 4,
  xs: 3,
  default: 2,
};

const IngredientStorageContainer = ({
  title,
  items,
  onEdit,
  setExpiringSoonItems,
  setIngredientData,
}: IngredientStorageContainerProps) => {
  const IconComponent =
    title === "expiringSoon" ? ITEM_STATUS_ICON[title] : STORAGE_ICON[title];

  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverColumnLimit, setIsOverColumnLimit] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const [ingredients, setIngredients] = useState<Ingredient[]>(items);

  const [selectedIngredient, setSelectedIngredient] =
    useState<Ingredient>(initialIngrdientItem);

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

  const updateIngredient = (updatedIngredient: Ingredient) => {
    setIngredients((prevItems) =>
      prevItems.map((item) =>
        item.userIngredientId === updatedIngredient.userIngredientId
          ? updatedIngredient
          : item,
      ),
    );

    setIngredientData?.((prevData) => {
      const storage = updatedIngredient.storage as
        | "freezer"
        | "fridge"
        | "roomTemp";

      const newData = prevData[storage].map((item) => {
        return item.userIngredientId === updatedIngredient.userIngredientId
          ? updatedIngredient
          : item;
      });

      return { ...prevData, [storage]: newData };
    });

    if (updatedIngredient.expirationDate <= EXPIRINGSOON_DAY) {
      setExpiringSoonItems?.((prevItems) =>
        prevItems?.map((item) =>
          item.userIngredientId === updatedIngredient.userIngredientId
            ? updatedIngredient
            : item,
        ),
      );
    }
  };

  const deleteIngredient = (deletedIngredient: Ingredient) => {
    setIngredients((prevItems) =>
      prevItems.filter(
        (item) => item.userIngredientId !== deletedIngredient.userIngredientId,
      ),
    );

    setIngredientData?.((prevData) => {
      const storage = deletedIngredient.storage as
        | "freezer"
        | "fridge"
        | "roomTemp";

      const newData = prevData[storage].filter((item) => {
        return item.userIngredientId !== deletedIngredient.userIngredientId;
      });

      return { ...prevData, [storage]: newData };
    });

    if (deletedIngredient.expirationDate < 7) {
      setExpiringSoonItems?.((prevItems) =>
        prevItems?.filter(
          (item) =>
            item.userIngredientId !== deletedIngredient.userIngredientId,
        ),
      );
    }
  };

  useEffect(() => {
    const handleResize = () => {
      let columns = COLUMN_SIZE.default;
      if (window.innerWidth >= 600) columns = COLUMN_SIZE.pc;
      else if (window.innerWidth >= 480) columns = COLUMN_SIZE.sm;
      else if (window.innerWidth >= 360) columns = COLUMN_SIZE.xs;

      setIsOverColumnLimit(ingredients.length > columns);
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
      {ingredients.length === 0 ? (
        <div className="flex h-10 w-full items-center justify-center">
          식자재가 없습니다.
        </div>
      ) : (
        <>
          <div
            className={`grid grid-cols-2 gap-2 p-2 mt-2 mb-3 pc:grid-cols-5 sm:grid-cols-4 xs:grid-cols-3 ${!isExpanded && "overflow-y-hidden h-[70px]"}`}
          >
            {ingredients.map((ingredient, idx) => {
              return (
                <IngredientButton
                  key={idx}
                  variant={ingredient.categoryId}
                  name={ingredient.ingredientName}
                  quantity={ingredient.ingredientQuantity}
                  expirationDate={ingredient.expirationDate}
                  onClick={() => handleOnIngredientBtn(ingredient)}
                  onEdit={onEdit}
                  id={ingredient.userIngredientId}
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
                selectedIngredient={selectedIngredient}
                setIsDeleteOpen={setIsDeleteOpen}
                deleteIngredient={deleteIngredient}
                setIsOpen={setIsOpen}
                updateIngredient={updateIngredient}
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
                ingredient={selectedIngredient}
                deleteIngredient={deleteIngredient}
              />
            )}
          </DamulModal>
        </>
      )}
    </div>
  );
};

export default IngredientStorageContainer;
