interface ChatAlarmProps {
  chatAlarmNum?: number;
  className?: string;
}

const ChatAlarm = ({ chatAlarmNum = 0, className }: ChatAlarmProps) => {
  return (
    <div
      className={`${className} flex right-1 top-0 h-4 w-4 pc:h-5 pc:w-5 rounded-full items-center justify-center bg-negative-500`}
    >
      <p className="text-xxxs text-white">{chatAlarmNum}</p>
    </div>
  );
};

export default ChatAlarm;
