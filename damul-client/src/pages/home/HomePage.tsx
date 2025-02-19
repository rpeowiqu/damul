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
import RefrigeratorDoor from "@/components/home/RefrigeratorDoor";

const HomePage = () => {
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
        console.log("식자재 정보를 받지 못했습니다.");
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
            <div className="relative w-full" key={`${storage}${Math.random()}`}>
              {(storage === "freezer" || storage === "fridge") && (
                <RefrigeratorDoor />
              )}
              <IngredientStorageContainer
                title={storage as keyof IngredientData}
                items={
                  filteredIngredientData[storage as keyof IngredientData] || []
                }
                onEdit={isEditMode}
                setExpiringSoonItems={setExpiringSoonItems}
                setIngredientData={setIngredientData}
              />
            </div>
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
