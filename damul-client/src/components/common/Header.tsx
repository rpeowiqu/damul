import AlarmIcon from "@/components/svg/AlarmIcon";
import OptionIcon from "@/components/svg/OptionIcon";
import { Link } from "react-router-dom";
import { useAlarmStore } from "@/stores/alarmStore";
import { useAlarmSubscription } from "@/hooks/useAlarmSubscription";
import useAuth from "@/hooks/useAuth";

const Header = () => {
  const { data, isLoading } = useAuth();
  const { alarmCnt, setAlarmCnt, increaseAlarmCnt } = useAlarmStore();

  useAlarmSubscription({
    userId: data?.data.id,
    onAlarmReceived: increaseAlarmCnt,
    setAlarmCnt,
  });

  if (isLoading) {
    return;
  }

  return (
    <header className="fixed top-0 left-0 right-0 w-full max-w-[600px] h-14 mx-auto bg-white pc:border-x border-b border-normal-100 z-50">
      <nav className="w-full h-full">
        <ul className="flex justify-between items-center w-full h-full px-5">
          <li className="relative flex items-center">
            <Link to={"/alarm"}>
              <AlarmIcon className="size-6 stroke-normal-700 hover:fill-normal-700" />
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
              <OptionIcon className="size-6 stroke-normal-700 fill-white hover:fill-normal-700 stroke-2" />
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
