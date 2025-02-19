import { useRef, useEffect, Dispatch, SetStateAction } from "react";
import CommentInput from "../common/CommentInput";
import { Comment } from "@/types/community";

interface FixedCommentInfoProps {
  id: string;
  replyingTo: Comment | null;
  setReplyingTo: Dispatch<SetStateAction<Comment | null>>;
  comment: string;
  setComment: Dispatch<SetStateAction<string>>;
  cancelReply: () => void;
  fetchDetailData: () => void;
  type: string;
}
const FixedCommentInfo = ({
  id,
  replyingTo,
  setReplyingTo,
  comment,
  setComment,
  cancelReply,
  fetchDetailData,
  type,
}: FixedCommentInfoProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (replyingTo) {
      inputRef.current?.focus();
    }
  }, [replyingTo]);
  return (
    <div className="fixed bottom-16 left-0 w-full pc:w-[598px] pc:left-1/2 pc:-translate-x-1/2 bg-white border-t p-2 shadow-md">
      {replyingTo && (
        <div className="mb-2 p-2 flex justify-between items-center text-start">
          <div>
            <p className="text-sm font-bold">{replyingTo.nickname}</p>
            <p className="text-sm">{replyingTo.comment}</p>
          </div>
          <div
            onClick={cancelReply}
            className="text-xs w-16 text-end pr-2 text-red-500 cursor-pointer"
          >
            취소
          </div>
        </div>
      )}
      <CommentInput
        ref={inputRef}
        placeholder={
          replyingTo ? "대댓글을 입력해주세요" : "댓글을 입력해주세요"
        }
        parentId={replyingTo?.id}
        id={id}
        comment={comment}
        setComment={setComment}
        setReplyingTo={setReplyingTo}
        fetchDetailData={fetchDetailData}
        type={type}
      />
    </div>
  );
};

export default FixedCommentInfo;
