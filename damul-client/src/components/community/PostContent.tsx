import { useState, Dispatch, SetStateAction, ChangeEvent } from "react";

interface PostContentProps {
  tempContent: string;
  setTempContent: Dispatch<SetStateAction<string>>;
}

const PostContent = ({ tempContent, setTempContent }: PostContentProps) => {
  const [isLimitExceeded, setIsLimitExceeded] = useState(false);
  const MAX_LENGTH = 500;

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_LENGTH) {
        setTempContent(value);
      setIsLimitExceeded(false);
    } else {
      setIsLimitExceeded(true);
    }
  };

  return (
    <>
      <textarea
        value={tempContent}
        onChange={handleChange}
        className={"w-full mt-5 p-5 border-2 rounded-md outline-none resize-none focus:border-positive-300"}
        placeholder="내용을 입력해주세요"
        rows={8}
      />
      <div className="flex justify-end items-center text-sm">
        <p className={isLimitExceeded ? "text-red-500" : "text-gray-500"}>
          {tempContent.length} / {MAX_LENGTH}
        </p>
      </div>
    </>
  );
};

export default PostContent;
