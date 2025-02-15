import CommentItem from "./CommentItem";
import { Comment } from "@/types/community";

interface CommentsSectionProps {
  id: string;
  comments: Comment[];
  onReply: (_comment: Comment) => void;
  currentChatNum?: number;
  chatSize?: number;
  status?: string;
  type: string;
  fetchDetailData: () => void;
}
const CommentsSection = ({
  id,
  comments = [],
  onReply,
  currentChatNum,
  chatSize,
  status,
  type,
  fetchDetailData,
}: CommentsSectionProps) => {
  // 최상위 댓글(대댓글이 아닌 댓글)만 필터링
  const topLevelComments = comments.filter((c) => !c.parentId);

  const StatusMarker = () =>
    status === "ACTIVE" ? (
      <div className="content-center bg-positive-200 px-3 rounded-full cursor-pointer">
        채팅방 참여하기 {currentChatNum}/{chatSize}
      </div>
    ) : (
      <div className="content-center bg-neutral-300 px-3 rounded-full cursor-pointer">
        채팅방 참여하기 {currentChatNum}/{chatSize}
      </div>
    );

  return (
    <div className="py-3 text-start">
      <div className="flex flex-row p-3 border-b border-neutral-300 justify-between">
        <h3 className="text-md pc:text-lg font-semibold">
          댓글({comments.length})
        </h3>
        {type === "market" && <StatusMarker />}
      </div>
      <div className="flex flex-col">
        {topLevelComments.map((comment) => {
          const replies = comments.filter((c) => c.parentId === comment.id);
          return (
            <CommentItem
              key={comment.id}
              id={id}
              comment={comment}
              replies={replies}
              onReply={onReply}
              fetchDetailData={fetchDetailData}
              type={type}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CommentsSection;
