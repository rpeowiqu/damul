import { FreezerIcon, FridgeIcon, RoomTemparatureIcon } from "@/components/svg";

// 냉동실,냉장실,실온보관
export const STORAGE_TYPE: Record<"freezer" | "fridge" | "roomTemp", string> = {
  freezer: "냉동실",
  fridge: "냉장실",
  roomTemp: "실온보관",
};

export const STORAGE_ICON = {
  freezer: FreezerIcon,
  fridge: FridgeIcon,
  roomTemp: RoomTemparatureIcon,
} as const;

export const STORAGE_TYPE_CONST: Record<
  "FREEZER" | "FRIDGE" | "ROOM_TEMPERATURE",
  string
> = {
  FREEZER: "냉동실",
  FRIDGE: "냉장실",
  ROOM_TEMPERATURE: "실온보관",
};

export const STORAGE_TYPE_MAP: Record<
  string,
  "FREEZER" | "FRIDGE" | "ROOM_TEMPERATURE"
> = {
  냉동실: "FREEZER",
  냉장실: "FRIDGE",
  실온보관: "ROOM_TEMPERATURE",
};
