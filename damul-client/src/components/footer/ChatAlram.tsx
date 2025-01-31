interface ChatAlarmProps {
  chatAlarmNum?: number
}

const ChatAlarm = ({ chatAlarmNum = 0 }: ChatAlarmProps) => {

  return (
    <div className="absolute flex right-1 top-0 h-4 w-4 pc:h-5 pc:w-5 rounded-full items-center justify-center bg-negative-500">
      <p className="text-xxxs text-white">{chatAlarmNum}</p>
    </div>
  );
};

export default ChatAlarm;
