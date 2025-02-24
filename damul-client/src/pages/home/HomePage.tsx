import { useEffect, useState } from "react";
import DamulCarousel from "@/components/common/DamulCarousel";
import DamulSearchBox from "@/components/common/DamulSearchBox";
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
import RefrigeratorDoor from "@/components/home/RefrigeratorDoor";
import useAuth from "@/hooks/useAuth";
import DamulSection from "@/components/common/DamulSection";
import { useQuery } from "@tanstack/react-query";

const HomePage = () => {
  const { data, isLoading } = useAuth();

  const [isEditMode, setIsEditMode] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterCategory, setFilterCategory] = useState("0");

  const {
    data: ingredientData = initialIngrdientData,
    isLoading: isDataFetchLoading,
  } = useQuery<IngredientData>({
    queryKey: ["ingredientData"],
    queryFn: async () => {
      try {
        const response = await getUserIndegredient();
        if (response.status === 204) {
          return initialIngrdientEmptyData;
        } else {
          return response.data;
        }
      } catch (err: any) {
        // console.log("식자재 정보를 받지 못했습니다.");
      }
    },
    staleTime: 1000 * 60 * 60,
  });

  const expiringSoonItems: Ingredient[] = Object.values(ingredientData)
    .flat()
    .filter((ingredient) => ingredient.expirationDate <= EXPIRINGSOON_DAY);

  let filteredIngredientData: IngredientData = ingredientData;

  const handleEditClick = () => {
    setIsEditMode((prev) => !prev);
  };

  if (filterCategory !== "0") {
    filteredIngredientData = Object.keys(ingredientData).reduce((acc, key) => {
      const storage = key as keyof IngredientData;
      const filteredItems = ingredientData[storage].filter(
        (item) => item.categoryId === parseInt(filterCategory),
      );
      return { ...acc, [storage]: filteredItems };
    }, {} as IngredientData);
  }

  if (searchKeyword.trim() !== "") {
    filteredIngredientData = Object.keys(filteredIngredientData).reduce(
      (acc, key) => {
        const storage = key as keyof IngredientData;
        const filteredItems = filteredIngredientData[storage].filter((item) =>
          item.ingredientName.includes(searchKeyword),
        );
        return { ...acc, [storage]: filteredItems };
      },
      {} as IngredientData,
    );
  }

  const viewData =
    searchKeyword.length > 0 || filterCategory !== "0"
      ? filteredIngredientData
      : ingredientData;

  if (isLoading && isDataFetchLoading) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      <div>
        <DamulSection
          title={
            <>
              {data?.data.nickname}
              <span className="text-sm sm:text-base font-bold">
                님 반갑습니다.
              </span>
            </>
          }
        />

        <DamulCarousel fetchFn={getRecommandedRecipe} />
      </div>

      <DamulSection
        title={"보유 중인 식자재"}
        className={`${isEditMode && "pb-36"}`}
      >
        <>
          <div className="flex gap-4">
            <DamulSearchBox
              className="w-full"
              placeholder="찾으시는 식자재를 검색해보세요."
              setInputValue={setSearchKeyword}
              onInputClick={() => {
                setSearchKeyword("");
              }}
              inputValue={searchKeyword}
            />
            <IngredientCategoryFilter onValueChange={setFilterCategory} />
          </div>
          {expiringSoonItems && expiringSoonItems.length > 0 && (
            <IngredientStorageContainer
              key={`expiringSoon ${Math.random()}`}
              title="expiringSoon"
              items={expiringSoonItems}
              onEdit={isEditMode}
            />
          )}

          {Object.keys(viewData).map((storage) => {
            if (storage === "expiringSoon") return null;

            return (
              <div
                className="relative w-full"
                key={`${storage}${Math.random()}`}
              >
                {(storage === "freezer" || storage === "fridge") &&
                  !sessionStorage.getItem(`doorOpened_${storage}`) && (
                    <RefrigeratorDoor storage={storage} />
                  )}
                <IngredientStorageContainer
                  title={storage as keyof IngredientData}
                  items={
                    filteredIngredientData[storage as keyof IngredientData] ||
                    []
                  }
                  onEdit={isEditMode}
                />
              </div>
            );
          })}
        </>
      </DamulSection>

      {isEditMode ? (
        <IngredientEditOverview onClose={handleEditClick} />
      ) : (
        <MenuButton onClick={handleEditClick} />
      )}
    </div>
  );
};

export default HomePage;
