import { Link, NavLink } from "react-router-dom";

const NavigationTab = [
  { to: "reports", name: "신고함" },
  { to: "users", name: "유저 관리" },
  { to: "posts", name: "게시글 관리" },
];

const Header = () => {
  return (
    <header className="w-full h-14 bg-white border-b border-b-normal-100">
      <nav className="w-full h-full px-28">
        <ul className="flex items-center gap-20 w-full h-full">
          <li>
            <Link to={"/"}>
              <img className="w-16" src="/logo.svg" alt="" />
            </Link>
          </li>
          <li className="flex gap-12 flex-1">
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
          <li className="flex gap-3 text-sm">
            <p>관리자 A</p>
            <button className="text-normal-400">로그아웃</button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
