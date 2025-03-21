interface ChatAlarmProps {
  unReadNum: string;
  className?: string;
}

const ChatAlarm = ({ unReadNum, className }: ChatAlarmProps) => {
  return (
    <div
      className={`flex right-1 top-0 h-4 w-4 pc:h-5 pc:w-5 rounded-full items-center justify-center bg-negative-500 ${className}`}
    >
      <p className="text-xxxs pc:text-xxs text-white">{unReadNum}</p>
    </div>
  );
};

export default ChatAlarm;
