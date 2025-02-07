import AlertTriangleIcon from "@/components/svg/AlertTriangleIcon";

export const ITEM_STATUS: Record<"expiringSoon", string> = {
  expiringSoon: "소비기한이 얼마 남지 않았어요!",
};

export const ITEM_STATUS_ICON = {
  expiringSoon: AlertTriangleIcon,
} as const;
