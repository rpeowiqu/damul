import { useState, Dispatch, SetStateAction, ChangeEvent } from "react";

interface PostTitleProps {
  tempTitle: string;
  setTempTitle: Dispatch<SetStateAction<string>>;
}

const PostTitle = ({ tempTitle, setTempTitle }: PostTitleProps) => {
  const [isLimitExceeded, setIsLimitExceeded] = useState(false);
  const MAX_LENGTH = 30;

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
        className={
          "w-full mt-5 p-5 border-2 rounded-md outline-none resize-none border-gray-300 focus:border-positive-300"
        }
        placeholder="제목을 입력해주세요"
        rows={3}
      />
      <div className="flex justify-end items-center text-sm">
        <p className="text-gray-500">
          {tempTitle.length} / {MAX_LENGTH}
        </p>
      </div>
    </>
  );
};

export default PostTitle;
