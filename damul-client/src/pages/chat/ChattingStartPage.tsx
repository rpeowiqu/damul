import { useState, ChangeEvent, useEffect } from "react";
import { Input } from "@/components/ui/input";
import SearchIcon from "@/components/svg/SearchIcon";
import Image from "@/components/common/Image";

const ChattingStartPage = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedFriends, setSelectedFriends] = useState<number[]>([]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  useEffect(() => {
    console.log(inputValue);
  }, [inputValue]);

  const mockData = {
    data: [
      { id: 1, image: "sds", nickname: "토마토러버전종우" },
      { id: 2, image: "sds", nickname: "채팅왕김채팅" },
      { id: 3, image: "sds", nickname: "하이퍼토마토" },
      { id: 4, image: "sds", nickname: "뭘봐?" },
      { id: 5, image: "sds", nickname: "깜찍이채팅" },
      { id: 6, image: "sds", nickname: "신속배달챗봇" },
      { id: 7, image: "sds", nickname: "그냥김철수" },
      { id: 8, image: "sds", nickname: "수다쟁이" },
    ],
  };

  const toggleSelection = (id: number) => {
    setSelectedFriends((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id],
    );
  };

  const removeSelectedFriend = (event: React.MouseEvent, id: number) => {
    event.stopPropagation();
    setSelectedFriends((prev) => prev.filter((fid) => fid !== id));
  };

  const startChat = () => {
    console.log("선택된 친구들과 채팅 시작:", selectedFriends);
  };

  return (
    <main className="h-full px-4 py-6 pc:px-6 space-y-2">
      <div className="flex justify-between items-center px-2">
        <div>{selectedFriends.length}명 선택</div>
        <button
          onClick={startChat}
          className={`w-auto h-auto rounded-lg px-3 py-0.5 border-2 transition ${
            selectedFriends.length > 0
              ? "border-positive-300 bg-white text-positive-500"
              : "border-gray-300 bg-white text-gray-500"
          }`}
        >
          채팅 시작
        </button>
      </div>

      {selectedFriends.length > 0 && (
        <div className="flex gap-2 py-3 whitespace-nowrap overflow-x-scroll">
          {selectedFriends.map((id) => {
            const friend = mockData.data.find((user) => user.id === id);
            return (
              <div
                key={id}
                className="flex items-center bg-primary-200 text-primary-700 px-3 py-0.5 rounded-full text-xs bg-neutral-200"
              >
                {friend?.nickname}
                <button
                  onClick={(event) => removeSelectedFriend(event, id)}
                  className="ml-1 p-1 rounded-full hover:bg-primary-300"
                >
                  X
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="relative">
        <Input
          placeholder="친구 검색"
          className="rounded-lg transition-colors p-2 pr-8 pc:pl-4 pc:pr-10 bg-normal-50 border border-normal-100 text-sm text-normal-700 focus:border-normal-500"
          onChange={handleInputChange}
          value={inputValue}
        />
        <button type="button" className="absolute inset-y-2 right-2 pc:right-3">
          <SearchIcon className="fill-normal-300" />
        </button>
      </div>

      <div className="space-y-4 mt-8">
        {mockData.data.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-neutral-100"
            onClick={() => toggleSelection(user.id)}
          >
            <div className="flex items-center gap-3">
              <Image src={user.image} className="w-12 h-12 rounded-full" />
              <p className="text-normal-700">{user.nickname}</p>
            </div>
            <input
              type="radio"
              readOnly
              checked={selectedFriends.includes(user.id)}
              className="w-5 h-5 text-primary-500 cursor-pointer"
            />
          </div>
        ))}
      </div>
    </main>
  );
};

export default ChattingStartPage;
