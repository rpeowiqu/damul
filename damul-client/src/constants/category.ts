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

// 곡물, 채소, 과일, 유제품, 육류, 달걀류, 수산물, 기름, 건조식품, 양념, 기타
export const CATEGORYNUMBER: Record<
  number,
  | "grains"
  | "vegetable"
  | "fruit"
  | "dairy"
  | "meat"
  | "egg"
  | "fish"
  | "oil"
  | "dry"
  | "seasoning"
  | "etc"
> = {
  0: "grains",
  1: "vegetable",
  2: "fruit",
  3: "dairy",
  4: "meat",
  5: "egg",
  6: "fish",
  7: "oil",
  8: "dry",
  9: "seasoning",
  10: "etc",
};

export const CATEGORY = {
  grains: GrainsIcon,
  vegetable: VegetableIcon,
  fruit: FruitIcon,
  dairy: DairyIcon,
  meat: MeatIcon,
  egg: EggIcon,
  fish: FishIcon,
  oil: OilIcon,
  dry: EtcIcon,
  seasoning: SeasoningIcon,
  etc: EtcIcon,
} as const;
