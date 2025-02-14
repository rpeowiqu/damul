import AlarmItem from "@/components/alarm/AlarmItem";

const AlarmPage = () => {
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
