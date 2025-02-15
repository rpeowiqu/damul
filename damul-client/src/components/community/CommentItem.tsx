import Image from "../common/Image";
import ReportButton from "../common/ReportButton";
import ReplyItem from "./ReplyItem";
import { Comment } from "@/types/community";
import { formatDate } from "@/utils/date";
import { deleteRecipeComment } from "@/service/recipe";
import { deletePostComment } from "@/service/market";
import useAuth from "@/hooks/useAuth";

interface CommentItemProps {
  id: string;
  comment: Comment;
  replies: Comment[];
  onReply: (_comment: Comment) => void;
  fetchDetailData: () => void;
  type: string;
}
const CommentItem = ({
  id,
  comment,
  replies,
  onReply,
  fetchDetailData,
  type,
}: CommentItemProps) => {
  const { data, isLoading } = useAuth();

  const deleteComment = async (commentId: number) => {
    const isConfirmed = window.confirm("정말로 댓글을 삭제하시겠습니까?");
    console.log("CommentItem id 값:", id);
    // console.log("CommentItem type 값:", type);

    if (!isConfirmed) {
      return;
    }

    try {
      const response =
        type === "recipe"
          ? await deleteRecipeComment({ recipeId: id, commentId })
          : await deletePostComment({ postId: id, commentId });

      console.log(response);
      fetchDetailData();
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return null;
  }

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
        {data?.data.id === comment.userId && (
          <div
            className="flex items-center gap-1"
            onClick={() => {
              deleteComment(comment.id);
            }}
          >
            <p className="text-xs">삭제</p>
          </div>
        )}
      </div>
      {replies.map((reply) => (
        <ReplyItem
          key={reply.id}
          id={id}
          comment={comment}
          reply={reply}
          onReply={onReply}
          fetchDetailData={fetchDetailData}
          type={type}
        />
      ))}
    </div>
  );
};

export default CommentItem;
