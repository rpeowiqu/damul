import AlarmIcon from "@/components/svg/AlarmIcon";
import OptionIcon from "@/components/svg/OptionIcon";
import { Link } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { useAlarmSubscription } from "@/hooks/useAlarmSubscription";
import { useState } from "react";

const Header = () => {
  const { data, isLoading } = useAuth();
  const userId = data?.data.id;
  const [alarmCnt, setAlarmCnt] = useState(0);

  useAlarmSubscription({
    userId,
    onAlarmReceived: (alarm) => {
      console.log("새 알림:", alarm);
      setAlarmCnt((prev) => prev + 1);
    },
    setAlarmCnt,
  });

  return (
    <header className="fixed top-0 left-0 right-0 w-full max-w-[600px] h-14 mx-auto bg-white border-x border-b border-normal-100 z-50">
      <nav className="w-full h-full">
        <ul className="flex justify-between items-center w-full h-full px-5">
          <li className="relative flex items-center">
            <Link to={"/alarm"}>
              <AlarmIcon className="w-6 stroke-normal-700" />
              {alarmCnt >= 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xxs rounded-full w-4 h-4 flex items-center justify-center">
                  {alarmCnt > 9 ? "9+" : alarmCnt}
                </span>
              )}
            </Link>
          </li>
          <li className="flex items-center">
            <Link to={"/home"}>
              <img className="w-14" src="/logo.svg" alt="" />
            </Link>
          </li>
          <li className="flex items-center">
            <Link to={"/setting"}>
              <OptionIcon className="w-6 stroke-normal-700 stroke-2" />
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
