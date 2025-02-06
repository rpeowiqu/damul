import DamulCarousel from "@/components/common/DamulCarousel";
import DamulSearchBox from "@/components/common/DamulSearchBox";
import UserGreeting from "@/components/home/UserGreeting";
import MenuButton from "@/components/home/MenuButton";
import StoredItemsCategories from "@/components/home/StoredItemsCategories";
import { STORAGE_TYPE } from "@/constants/storage";
import IngredientCategoryFilter from "@/components/home/IngredientCategoryFilter";

// 더미데이터 타입(임시)
type DATATYPE = {
  userIngredientId: number;
  categoryId: number;
  ingredientName: string;
  ingredientQuantity: number;
};

const storageOrder: (keyof typeof STORAGE_TYPE)[] = [
  "FREEZER",
  "FRIDGE",
  "ROOM_TEMPARATURE",
];

type GroupedData = Record<keyof typeof STORAGE_TYPE, DATATYPE[]>;

const groupedData: GroupedData = DATA.reduce((acc, item) => {
  if (!acc[item.ingredientStorage]) {
    acc[item.ingredientStorage] = [];
  }
  acc[item.ingredientStorage].push(item);
  return acc;
}, {} as GroupedData);

const HomePage = () => {
  return (
    <div>
      <UserGreeting />
      <DamulCarousel />

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
          const items = groupedData[storage];
          return items ? (
            <StoredItemsCategories
              key={storage}
              title={storage}
              items={items}
            />
          ) : null;
        })}
      </div>
      <MenuButton />
    </div>
  );
};

export default HomePage;
