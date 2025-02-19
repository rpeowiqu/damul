import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Image from "../common/Image";
import BadgeIcon from "../svg/BadgeIcon";
import { getTimeAgo } from "@/utils/date";
import useAuth from "@/hooks/useAuth";
import { useAlarmSubscription } from "@/hooks/useAlarmSubscription";

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

const AlarmItem = ({
  id,
  sender,
  content,
  createdAt,
  read,
  targetUrl,
  postType,
  type,
}: Alarm) => {
  const { data, isLoading } = useAuth();
  const userId = data?.data.id;
  const [link, setLink] = useState("");

  useEffect(() => {
    switch (type) {
      case "COMMENT":
        setLink(`/community/${postType}/${targetUrl}`);
        break;
      case "LIKE":
        setLink(`/community/${postType}/${targetUrl}`);
        break;
      case "BADGE":
        setLink(`/profile/${userId}/badge`);
        break;
      case "FOLLOW":
        setLink(`/profile/${sender?.id}/info`);
        break;
    }
  }, [id]);

  const { readMessage } = useAlarmSubscription({ userId });

  return (
    <div
      className="h-full text-center space-y-2 border-b"
      onClick={() => readMessage({ alarmId: id })}
    >
      <Link to={link}>
        <div className="flex items-center justify-between px-7 cursor-pointer">
          <div className="flex items-center gap-5 h-20">
            {sender?.profileImageUrl ? (
              <Image
                src={sender?.profileImageUrl}
                className="w-10 h-10 pc:w-12 pc:h-12 rounded-full"
              />
            ) : (
              <div className="flex w-10 pc:w-12 justify-center">
                <BadgeIcon className="w-8 pc:w-10" level={1} />
              </div>
            )}
            <div className="text-xs pc:text-sm">{content}</div>
          </div>
          <div className="flex flex-col text-xs pc:text-sm text-neutral-500 h-20 min-w-16 py-3 pc:py-2 justify-between">
            <div className="self-end">{getTimeAgo(createdAt)}</div>
            {read ? (
              <div className="self-end text-positive-400">읽음</div>
            ) : (
              <div className="self-end text-negative-500">안읽음</div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default AlarmItem;
