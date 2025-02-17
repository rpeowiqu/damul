import AlarmItem from "@/components/alarm/AlarmItem";
import { getAlarms, getUnreadAlarmCnt } from "@/service/alarm";
import { useEffect, useState } from "react";

const AlarmPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const fetchAlarms = async () => {
    try {
      setIsLoading(true);
      const response = await getAlarms();
      console.log(response);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUnreadAlarmCnt = async () => {
    try {
      const response = await getUnreadAlarmCnt();
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // fetchAlarms();
    fetchUnreadAlarmCnt();
  }, []);
  return (
    <main className="h-full text-centerspace-y-2">
      <div className="text-start p-3 border-b">읽지 않은 알림 6개</div>
      {[...Array(5)].map((_, index) => (
        <AlarmItem key={index} />
      ))}
    </main>
  );
};

export default AlarmPage;
