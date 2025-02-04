import { MouseEventHandler } from "react";
import { NavLink, useParams } from "react-router-dom";

export interface DamulTabItemProps {
  // URL 경로
  path: string;

  // 동적 경로일 경우, 경로 변수
  pathVariables?: string[];

  // 탭의 이름
  name: string;

  // 클릭시 호출할 이벤트
  onClick: MouseEventHandler<HTMLAnchorElement>;
}

const DamulTabItem = ({
  path,
  pathVariables,
  name,
  onClick = () => {},
}: DamulTabItemProps) => {
  const params = useParams();

  const getPath = () => {
    if (pathVariables && pathVariables.length > 0) {
      let resolvedPath = path;
      pathVariables.forEach((param) => {
        if (params[param]) {
          resolvedPath = resolvedPath.replace(`:${param}`, params[param]);
        }
      });

      return resolvedPath;
    }

    return path;
  };

  return (
    <NavLink
      className={({ isActive }) =>
        isActive
          ? "text-positive-400 flex-1 text-center font-bold"
          : "flex-1 text-center text-normal-200 font-bold"
      }
      to={getPath()}
      onClick={onClick}
    >
      {name}
    </NavLink>
  );
};

export default DamulTabItem;
