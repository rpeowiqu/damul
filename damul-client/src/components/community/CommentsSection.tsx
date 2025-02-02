import CommentItem from "./CommentItem";
import { Comment } from "@/types/interfaces";

interface CommentsSectionProps {
  comments: Comment[];
  onReply: (_comment: Comment) => void;
}
const CommentsSection = ({ comments, onReply }: CommentsSectionProps) => {
  // 최상위 댓글(대댓글이 아닌 댓글)만 필터링
  const topLevelComments = comments.filter((c) => !c.parentId);
  return (
    <div className="py-3 text-start">
      <h3 className="p-3 text-lg font-semibold border-t border-neutral-300">
        댓글({comments.length})
      </h3>
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
