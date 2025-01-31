import { MouseEventHandler } from "react";
import BadgeIcon from "../svg/BadgeIcon";

export interface BadgeProps {
  level: number;
  title?: string;
  onClick?: MouseEventHandler<HTMLElement>;
}

const Badge = ({ level, title, onClick }: BadgeProps) => {
  return (
    <div className="flex flex-col gap-2 items-center">
      <button
        className="transition duration-200 hover:scale-110"
        onClick={onClick}
      >
        <BadgeIcon className="w-10" level={level} />
      </button>
      <p className="w-20 text-center text-xs text-normal-700 truncate">
        {title}
      </p>
    </div>
  );
};

export default Badge;
