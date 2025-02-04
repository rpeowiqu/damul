import { FreezerIcon, FridgeIcon, RoomTemparatureIcon } from "@/components/svg";

// 냉동실,냉장실,실온보관
export const STORAGE_TYPE: Record<
  "FREEZER" | "FRIDGE" | "ROOM_TEMPARATURE",
  string
> = {
  FREEZER: "냉동실",
  FRIDGE: "냉장실",
  ROOM_TEMPARATURE: "실온보관",
};

export const STORAGE_ICON = {
  FREEZER: FreezerIcon,
  FRIDGE: FridgeIcon,
  ROOM_TEMPARATURE: RoomTemparatureIcon,
} as const;
