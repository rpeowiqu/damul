import { Dispatch, SetStateAction } from "react";
import DamulCommentInput from "../common/DamulCommentInput";
import { Comment } from "@/types/interfaces";

interface FixedCommentInputProps {
  replyingTo: Comment | null;
  comment: string;
  setComment: Dispatch<SetStateAction<string>>;
  cancelReply: () => void;
}
const FixedCommentInput = ({
  replyingTo,
  comment,
  setComment,
  cancelReply,
}: FixedCommentInputProps) => {
  return (
    <div className="fixed bottom-16 left-0 w-full pc:w-[598px] pc:left-1/2 pc:-translate-x-1/2 bg-white border-t p-2 shadow-md">
      {replyingTo && (
        <div className="mb-2 p-2 flex justify-between items-center text-start">
          <div>
            <p className="text-sm font-bold">{replyingTo.nickname}</p>
            <p className="text-sm">{replyingTo.comment}</p>
          </div>
          <div onClick={cancelReply} className="text-xs w-16 text-end pr-2 text-red-500">
            취소
          </div>
        </div>
      )}
      <DamulCommentInput
        placeholder={
          replyingTo ? "대댓글을 입력해주세요" : "댓글을 입력해주세요"
        }
        comment={comment}
        setComment={setComment}
      />
    </div>
  );
};

export default FixedCommentInput;
