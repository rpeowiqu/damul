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
