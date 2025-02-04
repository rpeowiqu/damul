import { NavLink } from "react-router-dom";
import Tab from "../footer/Tab";
import HomeIcon from "../svg/HomeIcon";
import StatisticsIcon from "../svg/StatisticsIcon";
import CommunityIcon from "../svg/CommunityIcon";
import ChattingIcon from "../svg/ChattingIcon";
import ProfileIcon from "../svg/ProfileIcon";
import useUserStore from "../../stores/user";

const Footer = () => {
  // Zustand에서 사용자의 userId를 가져온다.
  const myId = useUserStore((state) => state.myId);
  const tabs = [
    { to: "/", label: "홈", icon: HomeIcon },
    { to: "/statistics", label: "통계", icon: StatisticsIcon },
    { to: "/community", label: "커뮤니티", icon: CommunityIcon },
    { to: "/chatting", label: "채팅", icon: ChattingIcon },
    { to: `/profile/${myId}`, label: "프로필", icon: ProfileIcon },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 w-full max-w-[600px] h-16 mx-auto bg-white border-x border-t border-normal-100 z-50">
      <div className="flex w-full h-full">
        {tabs.map(({ to, label, icon: Icon }) => (
          <NavLink to={to} className="flex-1" key={to}>
            {({ isActive }) => (
              <Tab
                iconType={Icon}
                menuColor={isActive ? "white" : "black"}
                label={label}
                bgColor={isActive ? "bg-positive-300" : "white"}
              />
            )}
          </NavLink>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
