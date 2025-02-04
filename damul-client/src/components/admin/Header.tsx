import { Link, NavLink, useNavigate } from "react-router-dom";
import MenuIcon from "../svg/MenuIcon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const NavigationTab = [
  { to: "reports", name: "신고함" },
  { to: "users", name: "유저 관리" },
  { to: "posts", name: "게시글 관리" },
];

const Header = () => {
  const nav = useNavigate();

  return (
    <header className="w-full h-14 bg-white border-b border-b-normal-100">
      <nav className="w-4/5 h-full mx-auto">
        <ul className="flex justify-between items-center gap-12 w-full h-full">
          <li>
            <Link to={"/"}>
              <img className="min-w-16 max-w-16" src="/logo.svg" alt="" />
            </Link>
          </li>
          <li className="hidden pc_admin:flex gap-8 flex-1">
            {NavigationTab.map((item, index) => (
              <NavLink
                key={index}
                to={item.to}
                className={({ isActive }) =>
                  isActive
                    ? "text-positive-400 font-bold"
                    : "text-normal-200 font-bold"
                }
              >
                {item.name}
              </NavLink>
            ))}
          </li>
          <li className="hidden pc_admin:flex gap-3 text-sm">
            <p>관리자님 안녕하세요</p>
            <button className="text-normal-400">로그아웃</button>
          </li>
          <li>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="bg-white hover:bg-normal-50 rounded-full">
                  <MenuIcon className="block pc_admin:hidden w-8" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>설정</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => nav("/admin/login", { replace: true })}
                >
                  로그아웃
                </DropdownMenuItem>
                {NavigationTab.map((item, index) => (
                  <DropdownMenuItem
                    key={index}
                    onSelect={() => nav(`${item.to}`)}
                    className="data-[highlighted=true]:bg-red-50"
                  >
                    {item.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
