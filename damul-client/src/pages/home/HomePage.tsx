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

const HomePage = () => {
  const { data, isLoading } = useAuth();

  const [ingredientData, setIngredientData] =
    useState<IngredientData>(initialIngrdientData);

  const [expiringSoonItems, setExpiringSoonItems] = useState<Ingredient[]>(
    initialIngrdientItems,
  );

  const [isEditMode, setIsEditMode] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterCategory, setFilterCategory] = useState("0");

  const [filteredIngredientData, setFilteredIngredientData] =
    useState<IngredientData>(initialIngrdientData);

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
              ingredient.expirationDate >= 0
            );
          });
        setExpiringSoonItems(expiringSoonData);
      } catch (err: any) {
        // console.log("식자재 정보를 받지 못했습니다.");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filteredData = { ...ingredientData };

    if (filterCategory !== "0") {
      filteredData = Object.keys(filteredData).reduce((acc, key) => {
        const storage = key as keyof IngredientData;
        const filteredItems = filteredData[storage].filter(
          (item) => item.categoryId === parseInt(filterCategory),
        );
        return { ...acc, [storage]: filteredItems };
      }, {} as IngredientData);
    }

    if (searchKeyword.trim() !== "") {
      filteredData = Object.keys(filteredData).reduce((acc, key) => {
        const storage = key as keyof IngredientData;
        const filteredItems = filteredData[storage].filter((item) =>
          item.ingredientName.includes(searchKeyword),
        );
        return { ...acc, [storage]: filteredItems };
      }, {} as IngredientData);
    }

    setFilteredIngredientData(filteredData);
  }, [searchKeyword, filterCategory, ingredientData]);

  const viewData =
    searchKeyword.length > 0 || filterCategory !== "0"
      ? filteredIngredientData
      : ingredientData;

  if (isLoading) {
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
          {expiringSoonItems.length !== 0 && (
            <IngredientStorageContainer
              key={`expiringSoon ${Math.random()}`}
              title="expiringSoon"
              items={expiringSoonItems}
              onEdit={isEditMode}
              setIngredientData={setIngredientData}
              setExpiringSoonItems={setExpiringSoonItems}
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
                  !localStorage.getItem(`doorOpened_${storage}`) && (
                    <RefrigeratorDoor storage={storage} />
                  )}
                <IngredientStorageContainer
                  title={storage as keyof IngredientData}
                  items={
                    filteredIngredientData[storage as keyof IngredientData] ||
                    []
                  }
                  onEdit={isEditMode}
                  setExpiringSoonItems={setExpiringSoonItems}
                  setIngredientData={setIngredientData}
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
