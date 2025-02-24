import AlarmItem from "@/components/alarm/AlarmItem";
import { getAlarms, getUnreadAlarmCnt } from "@/service/alarm";
import { useEffect, useState } from "react";
import { useAlarmStore } from "@/stores/alarmStore";
import DamulSection from "@/components/common/DamulSection";

interface Alarm {
  id: number;
  sender?: {
    id: number;
    nickname?: string;
    profileImageUrl: string;
  };
  content: string;
  createdAt: string;
  read: boolean;
  targetUrl?: string;
  postType?: string;
  type: "COMMENT" | "LIKE" | "BADGE" | "FOLLOW";
}

const AlarmPage = () => {
  const { alarmCnt, setAlarmCnt } = useAlarmStore();
  const [alarms, setAlarms] = useState<Alarm[]>([]);

  const fetchAlarms = async () => {
    try {
      const response = await getAlarms();
      setAlarms(response.data.notifications);
      // console.log(response.data.notifications);
    } catch (error) {
      // console.log(error);
    }
  };

  const fetchUnreadAlarmCnt = async () => {
    try {
      const response = await getUnreadAlarmCnt();
      setAlarmCnt(response.data.unReadMessageNum);
      // console.log(response);
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    fetchAlarms();
    fetchUnreadAlarmCnt();
  }, [alarmCnt]);

  return (
    <DamulSection title={`읽지 않은 알림 ${alarmCnt}개`}>
      <div>
        {alarms?.map((alarm) => <AlarmItem key={alarm.id} {...alarm} />)}
      </div>
    </DamulSection>
  );
};

export default AlarmPage;
