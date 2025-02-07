import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { MouseEventHandler, ReactNode } from "react";

interface ButtonProps {
  type?: "submit" | "button";
  variant?:
    | "positive"
    | "positive-outline"
    | "negative"
    | "negative-outline"
    | "normal"
    | "normal-outline"
    | "shadow";
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children?: ReactNode;
  disabled?: boolean;
  required?: boolean;
}

const DamulButton = ({
  type = "button",
  variant,
  className,
  onClick,
  children,
  disabled
}: ButtonProps) => {
  return (
    <Button
      type={type}
      className={clsx(
        "text-base font-bold rounded-lg transition-colors ease-in-out",
        {
          "bg-positive-300 hover:bg-positive-400 text-white":
            variant === "positive",
          "bg-white hover:bg-normal-100 border-2 border-positive-400 text-normal-700":
            variant === "positive-outline",
          "bg-negative-300 hover:bg-negative-400 text-white":
            variant === "negative",
          "bg-white hover:bg-normal-100 border-2 border-negative-400 text-normal-700":
            variant === "negative-outline",
          "bg-normal-400 hover:bg-normal-500 text-white": variant === "normal",
          "bg-white hover:bg-normal-100 border-2 border-normal-400 text-normal-700":
            variant === "normal-outline",
          "bg-white hover:bg-normal-100 border border-normal-200 shadow-md text-normal-700":
            variant === "shadow",
        },
        className,
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );
};

export default DamulButton;
