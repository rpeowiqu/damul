import {
  EtcIcon,
  FruitIcon,
  FishIcon,
  SeasoningIcon,
  OilIcon,
  GrainsIcon,
  MeatIcon,
  EggIcon,
  DairyIcon,
  VegetableIcon,
} from "@/components/svg";

type CategoryKey =
  | "grains"
  | "vegetable"
  | "fruit"
  | "dairy"
  | "meat"
  | "egg"
  | "fish"
  | "oil"
  | "seasoning"
  | "etc";

// 카테고리 이름
export const CATEGORYNAME: Record<CategoryKey, string> = {
  grains: "곡물",
  vegetable: "채소",
  fruit: "과일",
  dairy: "유제품",
  meat: "육류",
  egg: "달걀류",
  fish: "수산물",
  oil: "기름",
  seasoning: "양념",
  etc: "기타",
};

// 카테고리 번호
// 곡물, 채소, 과일, 유제품, 육류, 달걀류, 수산물, 기름, 양념, 기타
export const CATEGORYNUMBER: Record<number, CategoryKey> = {
  0: "grains",
  1: "vegetable",
  2: "fruit",
  3: "dairy",
  4: "meat",
  5: "egg",
  6: "fish",
  7: "oil",
  8: "seasoning",
  9: "etc",
};

// 카테고리 아이콘
export const CATEGORY: Record<CategoryKey, React.ComponentType> = {
  grains: GrainsIcon,
  vegetable: VegetableIcon,
  fruit: FruitIcon,
  dairy: DairyIcon,
  meat: MeatIcon,
  egg: EggIcon,
  fish: FishIcon,
  oil: OilIcon,
  seasoning: SeasoningIcon,
  etc: EtcIcon,
};
