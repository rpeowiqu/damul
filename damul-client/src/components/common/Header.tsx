import AlarmIcon from "@/components/svg/AlarmIcon";
import OptionIcon from "@/components/svg/OptionIcon";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 w-full max-w-[600px] h-14 mx-auto bg-white border-x border-b border-normal-100 z-50">
      <nav className="w-full h-full">
        <ul className="flex justify-between items-center w-full h-full px-5">
          <li className="flex items-center">
            <button>
              <AlarmIcon className="stroke-normal-700" />
            </button>
          </li>
          <li className="flex items-center">
            <Link to={"/"}>
              <img className="w-14" src="/logo.svg" alt="" />
            </Link>
          </li>
          <li className="flex items-center">
            <button>
              <OptionIcon className="stroke-normal-700 stroke-2" />
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
