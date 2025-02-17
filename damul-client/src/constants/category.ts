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

export const CATEGORY_NAME_MAPPER = new Map();
CATEGORY_NAME_MAPPER.set(1, "곡물");
CATEGORY_NAME_MAPPER.set(2, "채소");
CATEGORY_NAME_MAPPER.set(3, "과일");
CATEGORY_NAME_MAPPER.set(4, "유제품");
CATEGORY_NAME_MAPPER.set(5, "육류");
CATEGORY_NAME_MAPPER.set(6, "달걀류");
CATEGORY_NAME_MAPPER.set(7, "수산물");
CATEGORY_NAME_MAPPER.set(8, "기름");
CATEGORY_NAME_MAPPER.set(9, "양념");
CATEGORY_NAME_MAPPER.set(10, "기타");

export const CATEGORY_NUMBER_MAPPER = new Map();
CATEGORY_NAME_MAPPER.set("곡물", 1);
CATEGORY_NAME_MAPPER.set("채소", 2);
CATEGORY_NAME_MAPPER.set("과일", 3);
CATEGORY_NAME_MAPPER.set("유제품", 4);
CATEGORY_NAME_MAPPER.set("육류", 5);
CATEGORY_NAME_MAPPER.set("달걀류", 6);
CATEGORY_NAME_MAPPER.set("수산물", 7);
CATEGORY_NAME_MAPPER.set("기름", 8);
CATEGORY_NAME_MAPPER.set("양념", 9);
CATEGORY_NAME_MAPPER.set("기타", 10);

export const CATEGORY_COLOR_MAPPER = new Map();
CATEGORY_COLOR_MAPPER.set("곡물", "#f28b82");
CATEGORY_COLOR_MAPPER.set("채소", "#fbbc04");
CATEGORY_COLOR_MAPPER.set("과일", "#fdd663");
CATEGORY_COLOR_MAPPER.set("유제품", "#97d174");
CATEGORY_COLOR_MAPPER.set("육류", "#6fcf97");
CATEGORY_COLOR_MAPPER.set("달걀류", "#76d7ea");
CATEGORY_COLOR_MAPPER.set("수산물", "#4a90e2");
CATEGORY_COLOR_MAPPER.set("기름", "#ab7fd0");
CATEGORY_COLOR_MAPPER.set("양념", "#f4a9c0");
CATEGORY_COLOR_MAPPER.set("기타", "#cfd8dc");
