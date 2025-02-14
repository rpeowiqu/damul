import Image from "../common/Image";

const AlarmItem = () => {
  return (
    <main className="h-full text-centerspace-y-2">
      <div className="flex items-center justify-between px-7 border-b">
        <div className="flex items-center gap-3 py-3">
          <Image className="w-14 h-14 rounded-full" />
          <div className="">나는서히 님이 내 레시피에 좋아요를 눌렀대요</div>
        </div>
        <div className="text-sm text-neutral-500 justify-between">
          <p>3분 전</p>
          <p>안읽음</p>
        </div>
      </div>
    </main>
  );
};

export default AlarmItem;
