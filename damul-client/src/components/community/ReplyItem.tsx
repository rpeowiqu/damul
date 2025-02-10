import Image from "../common/Image";
import { Comment } from "@/types/community";
import ReportButton from "../common/ReportButton";
import { formatDate } from "@/utils/date";
import { deleteRecipeComment } from "@/service/recipe";

interface ReplyItemProps {
  recipeId: string;
  comment: Comment;
  reply: Comment;
  onReply: (_comment: Comment) => void;
}
const ReplyItem = ({ recipeId, comment, reply, onReply }: ReplyItemProps) => {
  const deleteComment = async (commentId: number) => {
    try {
      const response = await deleteRecipeComment(recipeId, commentId);
      console.log(response?.data);
    } catch (error) {
      console.error(error);
    }
  };

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
        <div
          className="flex items-center gap-1"
          onClick={() => deleteComment(reply.id)}
        >
          <p className="text-xs">삭제</p>
        </div>
      </div>
    </div>
  );
};

export default ReplyItem;
