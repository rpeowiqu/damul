import { useState, Dispatch, SetStateAction, ChangeEvent } from "react";

interface PostTitleProps {
  tempTitle: string;
  setTempTitle: Dispatch<SetStateAction<string>>;
}

const PostTitle = ({ tempTitle, setTempTitle }: PostTitleProps) => {
  const [isLimitExceeded, setIsLimitExceeded] = useState(false);
  const MAX_LENGTH = 50;

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_LENGTH) {
      setTempTitle(value);
      setIsLimitExceeded(false);
    } else {
      setIsLimitExceeded(true);
    }
  };

  return (
    <>
      <textarea
        value={tempTitle}
        onChange={handleChange}
        className={`w-full mt-5 p-5 border-2 rounded-md outline-none resize-none ${
          isLimitExceeded ? "border-red-500" : "border-gray-300"
        }`}
        placeholder="제목을 입력해주세요"
        rows={3}
      />
      <div className="flex justify-between items-center mt-1 text-sm">
        {isLimitExceeded && (
          <p className="text-red-500">최대 50자까지 입력 가능합니다.</p>
        )}
        <p className={isLimitExceeded ? "text-red-500" : "text-gray-500"}>
          {tempTitle.length} / {MAX_LENGTH}
        </p>
      </div>
    </>
  );
};

export default PostTitle;
