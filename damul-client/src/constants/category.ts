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
import { SVGProps } from "@/types/svg";
import { ReactNode } from "react";

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

export const CATEGORY_NAME_MAPPER: Record<number, string> = {
  1: "곡물",
  2: "과일",
  3: "기름",
  4: "달걀류",
  5: "수산물",
  6: "양념",
  7: "유제품",
  8: "육류",
  9: "채소",
  10: "기타",
};

export const CATEGORY_ID_MAPPER: Record<string | number, number> = {
  곡물: 1,
  과일: 2,
  기름: 3,
  달걀류: 4,
  수산물: 5,
  양념: 6,
  유제품: 7,
  육류: 8,
  채소: 9,
  기타: 10,
};

export const CATEGORY_COLOR_MAPPER: Record<string, string> = {
  곡물: "#f28b82",
  과일: "#fbbc04",
  기름: "#fdd663",
  달걀류: "#97d174",
  수산물: "#6fcf97",
  양념: "#76d7ea",
  유제품: "#4a90e2",
  육류: "#ab7fd0",
  채소: "#f4a9c0",
  기타: "#cfd8dc",

  1: "#f28b82",
  2: "#fbbc04",
  3: "#fdd663",
  4: "#97d174",
  5: "#6fcf97",
  6: "#76d7ea",
  7: "#4a90e2",
  8: "#ab7fd0",
  9: "#f4a9c0",
  10: "#cfd8dc",
};

export const CATEGORY_ICON_MAPPER: Record<
  string,
  ({ className }: SVGProps) => ReactNode
> = {
  곡물: GrainsIcon,
  과일: FruitIcon,
  기름: OilIcon,
  달걀류: EggIcon,
  수산물: FishIcon,
  양념: SeasoningIcon,
  유제품: DairyIcon,
  육류: MeatIcon,
  채소: VegetableIcon,
  기타: EtcIcon,

  1: GrainsIcon,
  2: FruitIcon,
  3: OilIcon,
  4: EggIcon,
  5: FishIcon,
  6: SeasoningIcon,
  7: DairyIcon,
  8: MeatIcon,
  9: VegetableIcon,
  10: EtcIcon,
};
