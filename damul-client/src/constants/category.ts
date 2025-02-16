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

export const CATEGORY_INFO = {
  grains: {
    name: "곡물",
    icon: GrainsIcon,
    number: 1,
  },
  vegetable: {
    name: "채소",
    icon: VegetableIcon,
    number: 2,
  },
  fruit: {
    name: "과일",
    icon: FruitIcon,
    number: 3,
  },
  dairy: {
    name: "유제품",
    icon: DairyIcon,
    number: 4,
  },
  meat: {
    name: "육류",
    icon: MeatIcon,
    number: 5,
  },
  egg: {
    name: "달걀류",
    icon: EggIcon,
    number: 6,
  },
  fish: {
    name: "수산물",
    icon: FishIcon,
    number: 7,
  },
  oil: {
    name: "기름",
    icon: OilIcon,
    number: 8,
  },
  seasoning: {
    name: "양념",
    icon: SeasoningIcon,
    number: 9,
  },
  etc: {
    name: "기타",
    icon: EtcIcon,
    number: 10,
  },
} as const;

export const CATEGORY_INFO_KR = {
  곡물: {
    name: "grains",
    icon: GrainsIcon,
    number: 1,
  },
  채소: {
    name: "vegetable",
    icon: VegetableIcon,
    number: 2,
  },
  과일: {
    name: "fruit",
    icon: FruitIcon,
    number: 3,
  },
  유제품: {
    name: "dairy",
    icon: DairyIcon,
    number: 4,
  },
  육류: {
    name: "meat",
    icon: MeatIcon,
    number: 5,
  },
  달걀류: {
    name: "egg",
    icon: EggIcon,
    number: 6,
  },
  수산물: {
    name: "fish",
    icon: FishIcon,
    number: 7,
  },
  기름: {
    name: "oil",
    icon: OilIcon,
    number: 8,
  },
  양념: {
    name: "seasoning",
    icon: SeasoningIcon,
    number: 9,
  },
  기타: {
    name: "etc",
    icon: EtcIcon,
    number: 10,
  },
} as const;

export type CategoryKey = keyof typeof CATEGORY_INFO;
export const CATEGORYNAME = (key: CategoryKey) => CATEGORY_INFO[key].name;
export const CATEGORYNUMBER = (key: CategoryKey) => CATEGORY_INFO[key].number;
export const CATEGORYICON = (key: CategoryKey) => CATEGORY_INFO[key].icon;
