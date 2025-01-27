import { MouseEventHandler } from "react";
import { NavLink } from "react-router-dom";

export interface DamulTabItemProps {
  // URL 절대 경로
  absPath: string;

  // 탭의 이름
  name: string;

  // 클릭시 호출할 이벤트
  onClick: MouseEventHandler<HTMLAnchorElement>;
}

const DamulTabItem = ({
  absPath,
  name,
  onClick = () => {},
}: DamulTabItemProps) => {
  return (
    <NavLink
      className={({ isActive }) =>
        isActive
          ? "text-positive-400 flex-1 text-center font-bold"
          : "flex-1 text-center text-normal-200 font-bold"
      }
      to={absPath}
      onClick={onClick}
    >
      {name}
    </NavLink>
  );
};

export default DamulTabItem;
