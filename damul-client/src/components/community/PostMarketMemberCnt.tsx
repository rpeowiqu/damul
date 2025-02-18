import { Dispatch, SetStateAction, ChangeEvent } from "react";

interface PostMarketMemberCntProps {
  tempChatSize: number;
  setTempChatSize: Dispatch<SetStateAction<number>>;
}

const PostMarketMemberCnt = ({
  tempChatSize,
  setTempChatSize,
}: PostMarketMemberCntProps) => {
  const MAX_COUNT = 20;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= MAX_COUNT) {
      setTempChatSize(value);
    }
  };

  return (
    <div className="p-5">
      <h3 className="text-md pc:text-lg text-center font-semibold text-gray-700 mb-4">
        공구/나눔 최대 참여 인원수를 입력해주세요
      </h3>
      <div className="flex items-center gap-3">
        <input
          type="number"
          value={tempChatSize}
          onChange={handleChange}
          min={2}
          max={MAX_COUNT}
          className="w-20 border border-gray-300 rounded-lg px-3 py-1 text-center text-gray-700 focus:outline-none focus:ring-0"
        />
        <p className="text-gray-600">명</p>
      </div>
    </div>
  );
};

export default PostMarketMemberCnt;
