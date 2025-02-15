import Image from "../common/Image";
import { Comment } from "@/types/community";
import ReportButton from "../common/ReportButton";
import { formatDate } from "@/utils/date";
import { deleteRecipeComment } from "@/service/recipe";
import { deletePostComment } from "@/service/market";
import useAuth from "@/hooks/useAuth";

interface ReplyItemProps {
  id: string;
  comment: Comment;
  reply: Comment;
  onReply: (_comment: Comment) => void;
  fetchDetailData: () => void;
  type: string;
}
const ReplyItem = ({
  id,
  comment,
  reply,
  onReply,
  fetchDetailData,
  type,
}: ReplyItemProps) => {
  const { data, isLoading } = useAuth();
  const deleteComment = async (commentId: number) => {
    const isConfirmed = window.confirm("정말로 댓글을 삭제하시겠습니까?");

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
    <div className="ml-6 mt-2 bg-neutral-100 p-2 rounded-md">
      <div className="flex items-center gap-2">
        <Image src={reply.profileImageUrl} className="w-10 h-10 rounded-full" />
        <div className="flex flex-1 justify-between">
          <p className="font-semibold text-sm">{reply.nickname}</p>
          <p className="text-xs text-neutral-500">
            {formatDate(reply.createdAt)}
          </p>
        </div>
      </div>
      <p className="text-sm ml-12 pb-1">{reply.comment}</p>
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
        {data?.data.id === reply.userId && (
          <div
            className="flex items-center gap-1"
            onClick={() => deleteComment(reply.id)}
          >
            <p className="text-xs">삭제</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReplyItem;
