import { Dispatch, SetStateAction, ChangeEvent } from "react";

interface PostMarketMemberCntProps {
  tempMemberCnt: number;
  setTempMemberCnt: Dispatch<SetStateAction<number>>;
}

const PostMarketMemberCnt = ({
  tempMemberCnt,
  setTempMemberCnt,
}: PostMarketMemberCntProps) => {
  const MAX_COUNT = 100;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= MAX_COUNT) {
      setTempMemberCnt(value);
    }
  };

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        공구/나눔 최대 참여 인원수를 입력해주세요
      </h3>
      <div className="flex items-center gap-3">
        <input
          type="number"
          value={tempMemberCnt}
          onChange={handleChange}
          min={1}
          max={MAX_COUNT}
          className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-center text-gray-700 focus:outline-none focus:ring-0"
        />
        <p className="text-gray-600">명</p>
      </div>
    </div>
  );
};

export default PostMarketMemberCnt;
