import {
  forwardRef,
  ChangeEvent,
  KeyboardEvent,
  Dispatch,
  SetStateAction,
} from "react";
import { Input } from "@/components/ui/input";
import SendIcon from "../svg/SendIcon";
import { postRecipeComment } from "@/service/recipe";
import { postPostComment } from "@/service/market";
import { Comment } from "@/types/community";

interface CommentInputProps {
  id: string;
  parentId?: number;
  placeholder?: string;
  comment: string;
  setComment: Dispatch<SetStateAction<string>>;
  className?: string;
  setReplyingTo: Dispatch<SetStateAction<Comment | null>>;
  fetchDetailData: () => void;
  type: string;
}

const CommentInput = forwardRef<HTMLInputElement, CommentInputProps>(
  (
    {
      id,
      parentId,
      placeholder,
      comment,
      setComment,
      className = "",
      setReplyingTo,
      fetchDetailData,
      type,
    },
    ref,
  ) => {
    // 입력값 변경 핸들러
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      setComment(e.target.value);
    };

    // 엔터 키 입력 핸들러
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleButtonClick();
      }
    };

    // 입력 버튼 클릭 핸들러
    const handleButtonClick = () => {
      submitComment();
    };

    const submitComment = async () => {
      if (comment.trim() === "") {
        alert("앗! 댓글이 비어있어요. 내용을 입력해 주세요. ✏️");
        setComment("");
        return;
      }
      try {
        const response =
          type === "recipe"
            ? await postRecipeComment({
                recipeId: id,
                comment,
                parentId,
              })
            : await postPostComment({
                postId: id,
                comment,
                parentId,
              });

        console.log(response);
        setReplyingTo(null);
        setComment("");
        fetchDetailData();
      } catch (error) {
        console.error(error);
      }
    };

    return (
      <div className={`relative ${className}`}>
        <Input
          ref={ref} // forwardRef를 사용했으므로 ref를 올바르게 전달
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
  },
);

export default CommentInput;
