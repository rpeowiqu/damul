import { MouseEventHandler } from "react";
import BadgeIcon from "../svg/BadgeIcon";
import clsx from "clsx";

export interface BadgeProps {
  title?: string;
  level: number;
  onClick?: MouseEventHandler<HTMLElement>;
}

const Badge = ({ title, level, onClick }: BadgeProps) => {
  return (
    <div className="flex flex-col gap-2 items-center">
      <div
        className={clsx({
          "transition duration-200 cursor-pointer hover:scale-110 ": onClick,
        })}
        onClick={onClick}
      >
        <BadgeIcon className="w-10" level={level} />
      </div>
      <p className="w-20 text-center text-xs text-normal-700 truncate">
        {title}
      </p>
    </div>
  );
};

export default Badge;
