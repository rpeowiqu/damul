import { useEffect, useState } from "react";

import DamulCarousel from "@/components/common/DamulCarousel";
import DamulSearchBox from "@/components/common/DamulSearchBox";
import UserGreeting from "@/components/home/UserGreeting";
import MenuButton from "@/components/home/MenuButton";
import IngredientStorageContainer from "@/components/home/IngredientStorageContainer";
import IngredientCategoryFilter from "@/components/home/IngredientCategoryFilter";
import { IngredientData, Ingredient } from "@/types/Ingredient";
import IngredientEditOverview from "@/components/home/IngredientEditOverview";
import { getRecommandedRecipe, getUserIndegredient } from "@/service/home";
import {
  initialIngrdientData,
  initialIngrdientEmptyData,
  initialIngrdientItems,
} from "@/constants/initialData";
import { EXPIRINGSOON_DAY } from "@/constants/itemStatus";

const HomePage = () => {
  const [ingredientData, setIngredientData] =
    useState<IngredientData>(initialIngrdientData);

  const [expiringSoonItems, setExpiringSoonItems] = useState<Ingredient[]>(
    initialIngrdientItems,
  );

  const [isEditMode, setIsEditMode] = useState(false);

  const handleEditClick = () => {
    setIsEditMode((prev) => !prev);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUserIndegredient();
        if (response.status === 204) {
          setIngredientData(initialIngrdientEmptyData);
        } else {
          setIngredientData(response.data);
        }
        const expiringSoonData: Ingredient[] = Object.values(
          response.data as IngredientData,
        )
          .flat()
          .filter((ingredient: Ingredient) => {
            return (
              ingredient.expirationDate <= EXPIRINGSOON_DAY &&
              ingredient.expirationDate > 0
            );
          });
        setExpiringSoonItems(expiringSoonData);
      } catch (err) {
        console.log("식자재 정보를 받지 못했습니다.");
      }
    };

    fetchData();
  }, []);

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
        {expiringSoonItems.length !== 0 && (
          <IngredientStorageContainer
            key={`expiringSoon${Math.random()}`}
            title="expiringSoon"
            items={expiringSoonItems}
            onEdit={isEditMode}
            setIngredientData={setIngredientData}
            setExpiringSoonItems={setExpiringSoonItems}
          />
        )}
        {Object.keys(ingredientData).map((storage) => {
          if (storage === "expiringSoon") return null;

          return (
            <IngredientStorageContainer
              key={`${storage}${Math.random()}`}
              title={storage as keyof IngredientData}
              items={ingredientData[storage as keyof IngredientData] || []}
              onEdit={isEditMode}
              setExpiringSoonItems={setExpiringSoonItems}
              setIngredientData={setIngredientData}
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
