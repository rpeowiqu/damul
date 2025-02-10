import { ChangeEvent, KeyboardEvent, Dispatch, SetStateAction } from "react";
import { Input } from "@/components/ui/input";
import SendIcon from "../svg/SendIcon";
import { postRecipeComment } from "@/service/recipe";

interface CommentInputProps {
  recipeId: string;
  placeholder?: string;
  onButtonClick?: (_value: string) => void; // 버튼 클릭 이벤트 (입력값 전달)
  comment: string;
  setComment: Dispatch<SetStateAction<string>>; // 상태 업데이트 함수
  className?: string; // 추가된 스타일링 prop
}

const CommentInput = ({
  recipeId,
  placeholder,
  onButtonClick,
  comment,
  setComment,
  className = "",
}: CommentInputProps) => {
  // 입력값 변경 핸들러
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  // 엔터 키 입력 핸들러
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && (comment || "").trim() !== "") {
      e.preventDefault();
      onButtonClick?.(comment || ""); // 기본값 "" 설정
      setComment("");
    }
  };

  // 입력 버튼 클릭 핸들러
  const handleButtonClick = () => {
    submitComment();
    console.log(comment);
    setComment("");
  };

  const authorId = "1"
  const submitComment = async () => {
    try {
      const response = await postRecipeComment({recipeId, authorId, comment});
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className={`relative ${className}`}>
      <Input
        placeholder={placeholder}
        className={`${className} rounded-lg transition-colors p-2 pr-8 pc:pl-4 pc:pr-10 bg-normal-50 border border-normal-100 text-sm text-normal-700 focus:border-normal-500`}
        onChange={handleInputChange}
        value={comment}
        onKeyDown={handleKeyDown}
      />
      <button
        type="button"
        className="absolute inset-y-2 right-2 pc:right-3"
        onClick={handleButtonClick}
      >
        <SendIcon className="w-7 h-7" />
      </button>
    </div>
  );
};

export default CommentInput;
