import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import clsx from "clsx";
import { Button } from "@/components/ui/button";

interface DamulDropdownProps {
  variant:
    | "positive"
    | "positive-outline"
    | "negative"
    | "negative-outline"
    | "normal"
    | "normal-outline"
    | "shadow"
    | "round";
  size?: "sm" | "md" | "lg" | "full";
  px?: number;
  textSize?: "sm" | "base" | "lg";
  fontWeight?: string;
  label: string;
  items: { label: string; onClick: () => void }[];
}

const DamulDropdown = ({
  variant,
  size,
  px = 3,
  textSize = "sm",
  fontWeight,
  label,
  items,
}: DamulDropdownProps) => {
  const triggerClass = clsx(
    `px-${px} text-${textSize} rounded-lg transition-colors`,
    {
      "bg-positive-300 hover:bg-positive-400 text-white": variant === "positive",
      "bg-white hover:bg-normal-100 border-1 border-positive-400 text-normal-700":
        variant === "positive-outline",
      "bg-negative-300 hover:bg-negative-400 text-white": variant === "negative",
      "bg-white hover:bg-normal-100 border-1 border-negative-400 text-normal-700":
        variant === "negative-outline",
      "bg-normal-400 hover:bg-normal-500 text-white": variant === "normal",
      "bg-white hover:bg-normal-100 border-1 border-normal-200 text-normal-700":
        variant === "normal-outline",
      "bg-white hover:bg-normal-100 border border-normal-200 shadow-md text-normal-700":
        variant === "shadow",
      "bg-positive-300 hover:bg-positive-400 rounded-full h-12 w-12": variant === "round",
    },
    {
      "min-w-[70px]": size === "sm",
      "min-w-[85px]": size === "md",
      "min-w-[100px]": size === "lg",
      "min-w-full": size === "full",
    },
    {
      "font-light": fontWeight === "300",
      "font-normal": fontWeight === "400",
      "font-medium": fontWeight === "500",
      "font-semibold": fontWeight === "600",
      "font-bold": !fontWeight,
      "font-extrabold": fontWeight === "700",
      "font-black": fontWeight === "900",
    }
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className={triggerClass}>{label}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-full bg-white border border-gray-200 rounded-md shadow-lg">
        {items.map((item, index) => (
          <DropdownMenuItem
            key={index}
            className="cursor-pointer px-2 py-2 text-gray-700 hover:bg-gray-100 rounded-sm"
            onClick={item.onClick}
          >
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DamulDropdown;
