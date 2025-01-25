import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { MouseEventHandler, ReactNode } from "react";

interface ButtonProps {
  variant: // 스타일
  | "positive"
    | "positive-outline"
    | "negative"
    | "negative-outline"
    | "normal"
    | "normal-outline";
  size?: "sm" | "md" | "lg" | "full"; // 크기(default: 텍스트 길이에 px-3이 추가된 크기를 가짐)
  textSize?: "sm" | "base" | "lg"; // 텍스트 사이즈(default: sm)
  fontWeight?: string; // 폰트 굵기(default: bold)
  onClick: MouseEventHandler<HTMLButtonElement>; // 클릭시 호출할 이벤트
  children?: ReactNode; // 아이콘, 텍스트 등
}

const DamulButton = ({
  variant,
  size,
  textSize,
  fontWeight,
  onClick,
  children,
}: ButtonProps) => {
  const className = clsx(
    "px-3 rounded-lg font-medium transition-colors",
    {
      "bg-positive-300 hover:bg-positive-400 text-white":
        variant === "positive",
      "bg-white hover:bg-normal-100 border-2 border-positive-400 text-normal-800":
        variant === "positive-outline",
      "bg-negative-300 hover:bg-negative-400 text-white":
        variant === "negative",
      "bg-white hover:bg-normal-100 border-2 border-negative-400 text-normal-800":
        variant === "negative-outline",
      "bg-normal-400 hover:bg-normal-500 text-white": variant === "normal",
      "bg-white hover:bg-normal-100 border-2 border-normal-400 text-normal-800":
        variant === "normal-outline",
    },
    {
      "min-w-[70px]": size === "sm",
      "min-w-[85px]": size === "md",
      "min-w-[100px]": size === "lg",
      "min-w-full": size === "full",
    },
    textSize ? `text-${textSize}` : "text-sm",
    {
      "font-light": fontWeight === "300",
      "font-normal": fontWeight === "400",
      "font-medium": fontWeight === "500",
      "font-semibold": fontWeight === "600",
      "font-bold": !fontWeight,
      "font-extrabold": fontWeight === "800",
      "font-black": fontWeight === "900",
    },
  );

  return (
    <Button className={className} onClick={onClick}>
      {children}
    </Button>
  );
};

export default DamulButton;
