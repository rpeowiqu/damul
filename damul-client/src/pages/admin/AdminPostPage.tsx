import clsx from "clsx";
import { Suspense } from "react";
import { NavLink, Outlet } from "react-router-dom";

const AdminPostPage = () => {
  return (
    <div className="flex flex-col gap-4 w-full h-full p-6">
      <div className="flex gap-5">
        <NavLink
          to={"recipe"}
          className={({ isActive }) =>
            clsx("xs:text-base pc_admin:text-lg font-bold text-normal-200", {
              "text-positive-400 border-b-2 border-positive-400": isActive,
            })
          }
        >
          레시피 게시판
        </NavLink>
        <NavLink
          to={"market"}
          className={({ isActive }) =>
            clsx("xs:text-base pc_admin:text-lg font-bold text-normal-200", {
              "text-positive-400 border-b-2 border-positive-400": isActive,
            })
          }
        >
          공구/나눔 게시판
        </NavLink>
      </div>

      <Suspense fallback={<div></div>}>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default AdminPostPage;
