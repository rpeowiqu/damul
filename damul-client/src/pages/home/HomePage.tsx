import { useEffect, useState } from "react";

import DamulCarousel from "@/components/common/DamulCarousel";
import DamulSearchBox from "@/components/common/DamulSearchBox";
import UserGreeting from "@/components/home/UserGreeting";
import MenuButton from "@/components/home/MenuButton";
import IngredientStorageContainer from "@/components/home/IngredientStorageContainer";
import IngredientCategoryFilter from "@/components/home/IngredientCategoryFilter";

import { STORAGE_TYPE } from "@/constants/storage";
import { ITEM_STATUS } from "@/constants/itemStatus";
import { IngredientData, Ingredient } from "@/types/Ingredient";
import IngredientEditOverview from "@/components/home/IngredientEditOverview";
import { getRecommandedRecipe, getUserIndegredient } from "@/service/home";

const HomePage = () => {
  const [ingredientData, setIngredientData] = useState<IngredientData>();

  const [isEditMode, setIsEditMode] = useState(false);

  const handleEditClick = () => {
    setIsEditMode((prev) => !prev);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUserIndegredient();
        const expiringSoonItems: Ingredient[] = Object.values(
          response.data as IngredientData,
        )
          .flat()
          .filter((ingredient: Ingredient) => {
            return (
              ingredient.expirationDate <= 7 && ingredient.expirationDate > 0
            );
          });

        setIngredientData({
          ...response.data,
          expiringSoon: expiringSoonItems,
        });
      } catch (err) {
        console.log("식자재 정보를 받지 못했습니다.");
      }
    };

    fetchData();
  }, []);

  if (!ingredientData) return null;

  const storageOrder: (keyof typeof STORAGE_TYPE | keyof typeof ITEM_STATUS)[] =
    ["expiringSoon", "freezer", "fridge", "roomTemp"];

  return (
    <div className={`${isEditMode && "pb-32"}`}>
      <UserGreeting />
      <DamulCarousel fetchFn={getRecommandedRecipe} />

      <div className="p-[10px]">
        <p className="py-[10px] font-bold">보유 중인 식자재</p>
        <div className="flex gap-4">
          <DamulSearchBox
            className="w-full"
            placeholder="찾으시는 식자재를 검색해보세요."
          />
          <IngredientCategoryFilter />
        </div>
        {storageOrder.map((storage) => {
          const items = ingredientData[storage] || [];
          return storage === "expiringSoon" && items.length === 0 ? null : (
            <IngredientStorageContainer
              key={storage}
              title={storage}
              items={items}
              onEdit={isEditMode}
            />
          );
        })}
      </div>
      {isEditMode ? (
        <IngredientEditOverview onClose={handleEditClick} />
      ) : (
        <MenuButton onClick={handleEditClick} />
      )}
    </div>
  );
};

export default HomePage;
