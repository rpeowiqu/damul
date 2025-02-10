import Image from "../common/Image";
import ReportButton from "../common/ReportButton";
import ReplyItem from "./ReplyItem";
import { Comment } from "@/types/community";
import { formatDate } from "@/utils/date";
import { deleteRecipeComment } from "@/service/recipe";

interface CommentItemProps {
  recipeId: string;
  comment: Comment;
  replies: Comment[];
  onReply: (_comment: Comment) => void;
  fetchRecipeDetail: () => void;
}
const CommentItem = ({
  recipeId,
  comment,
  replies,
  onReply,
  fetchRecipeDetail
}: CommentItemProps) => {
  const deleteComment = async (commentId: number) => {
    const isConfirmed = window.confirm("정말로 댓글을 삭제하시겠습니까?");

    if (!isConfirmed) {
      return;
    }
    try {
      const response = await deleteRecipeComment(recipeId, commentId);
      console.log(response);
      fetchRecipeDetail();
    } catch (error) {
      console.error(error);
    }
  };

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
            {formatDate(comment.createdAt)}
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
        <div
          className="flex items-center gap-1"
          onClick={() => {
            deleteComment(comment.id);
          }}
        >
          <p className="text-xs">삭제</p>
        </div>
      </div>
      {replies.map((reply) => (
        <ReplyItem
          key={reply.id}
          recipeId={recipeId}
          comment={comment}
          reply={reply}
          onReply={onReply}
          fetchRecipeDetail={fetchRecipeDetail}
        />
      ))}
    </div>
  );
};

export default CommentItem;
