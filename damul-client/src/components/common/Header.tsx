import AlarmIcon from "@/components/svg/AlarmIcon";
import OptionIcon from "@/components/svg/OptionIcon";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header>
      <nav className="h-14 border-b-[1px] border-gray-200">
        <ul className="flex justify-between h-full px-5">
          <li className="flex items-center">
            <button>
              <AlarmIcon className="stroke-neutral-700" />
            </button>
          </li>
          <li className="flex items-center">
            <Link to={"/"}>
              <img className="w-14" src="/logo.svg" alt="" />
            </Link>
          </li>
          <li className="flex items-center">
            <button>
              <OptionIcon className="stroke-neutral-700 stroke-2" />
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
