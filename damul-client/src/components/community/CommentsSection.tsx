import CommentItem from "./CommentItem";
import { Comment } from "@/types/interfaces";

interface CommentsSectionProps {
  comments: Comment[];
  onReply: (_comment: Comment) => void;
  currentMemberNum?: number;
  maxMemberSize?: number;
  type?: string;
}
const CommentsSection = ({ comments, onReply, currentMemberNum, maxMemberSize, type }: CommentsSectionProps) => {
  // 최상위 댓글(대댓글이 아닌 댓글)만 필터링
  const topLevelComments = comments.filter((c) => !c.parentId);
  return (
    <div className="py-3 text-start">
      <div className="flex flex-row p-3 border-b border-neutral-300 justify-between">
      <h3 className="text-lg font-semibold">
        댓글({comments.length})
      </h3>
      {type === "market" && <div className="bg-positive-200 px-3 rounded-full cursor-pointer">채팅방 참여하기 {currentMemberNum}/{maxMemberSize}</div>}
      </div>
      <div className="flex flex-col gap-3">
        {topLevelComments.map((comment) => {
          const replies = comments.filter((c) => c.parentId === comment.id);
          return (
            <CommentItem
              key={comment.id}
              comment={comment}
              replies={replies}
              onReply={onReply}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CommentsSection;
