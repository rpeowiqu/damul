import Image from "../common/Image";
import ReportButton from "../common/ReportButton";
import ReplyItem from "./ReplyItem";
import { Comment } from "@/types/community";

interface CommentItemProps {
  comment: Comment;
  replies: Comment[];
  onReply: (_comment: Comment) => void;
}
const CommentItem = ({ comment, replies, onReply }: CommentItemProps) => {
  return (
    <div className="py-3">
      <div className="flex items-center gap-2">
        <Image
          src={comment.profileImageUrl}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex flex-1 justify-between pr-2">
          <p className="font-semibold text-sm">{comment.nickname}</p>
          <p className="text-xs text-neutral-500">
            {comment.createdAt.split("T")[0]}{" "}
            {comment.createdAt.split("T")[1].slice(0, 5)}
          </p>
        </div>
      </div>
      <p className="text-sm ml-12 pb-1">{comment.comment}</p>
      <div className="flex justify-start gap-2 ml-12 cursor-pointer text-neutral-500">
        <ReportButton className="flex items-center gap-1">
          <p className="text-xs">신고</p>
        </ReportButton>
        <div
          className="flex items-center gap-1"
          onClick={() => onReply(comment)}
        >
          <p className="text-xs">답글</p>
        </div>
        <div className="flex items-center gap-1">
          <p className="text-xs">삭제</p>
        </div>
      </div>
      {replies.map((reply) => (
        <ReplyItem key={reply.id} reply={reply} onReply={onReply} />
      ))}
    </div>
  );
};

export default CommentItem;
