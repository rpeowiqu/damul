import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CommunityDetailHeader from "@/components/community/CommunityDetailHeader";
import AuthorInfo from "@/components/community/AuthorInfo";
import ContentSection from "@/components/community/ContentSection";
import CommentsSection from "@/components/community/CommentsSection";
import FixedCommentInfo from "@/components/community/FixedCommentInfo";
import { getPostDetail } from "@/service/market";
import { Comment, PostDetail } from "@/types/community";

const CommunityMarketDetailPage = () => {
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [comment, setComment] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { postId } = useParams();

  const initialPostDetail: PostDetail = {
    id: "0",
    title: "",
    authorId: 0,
    authorName: "",
    profileImageUrl: "",
    status: "ACTIVE",
    contentImageUrl: "",
    content: "",
    createdAt: "",
    currentChatNum: 0,
    chatRoomId: 0,
    chatSize: 0,
    entered: false,
    viewCnt: 0,
    comments: [],
  };

  const [data, setData] = useState<PostDetail>(initialPostDetail);

  const fetchPostDetail = async () => {
    try {
      setIsLoading(true);
      const response = await getPostDetail(postId);
      setData(response?.data as PostDetail);
      console.log(response?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPostDetail();
  }, []);

  const cancelReply = () => {
    setReplyingTo(null);
  };

  return (
    <main
      className={`relative flex flex-col justify-center w-full text-center p-6 ${
        replyingTo ? "pc:pb-24" : "pc:pb-6"
      } mb-8`}
    >
      <CommunityDetailHeader
        title={data.title}
        createdAt={data.createdAt}
        status={data.status}
        id={data.id}
        authorId={data.authorId}
        isLoading={isLoading}
        type="market"
      />
      <AuthorInfo
        profileImageUrl={data.profileImageUrl}
        authorName={data.authorName}
        authorId={data.authorId}
        viewCnt={data.viewCnt}
        id={data.id}
        isLoading={isLoading}
        type="market"
      />
      <ContentSection
        contentImageUrl={data.contentImageUrl}
        content={data.content}
        isLoading={isLoading}
        type="market"
      />
      <CommentsSection
        id={data.id}
        comments={data.comments}
        onReply={(comment) => setReplyingTo(comment)}
        currentChatNum={data.currentChatNum}
        chatSize={data.chatSize}
        fetchDetailData={fetchPostDetail}
        entered={data.entered}
        chatRoomId={data.chatRoomId}
        status={data.status}
        type="market"
      />
      <FixedCommentInfo
        id={postId || ""}
        replyingTo={replyingTo}
        setReplyingTo={setReplyingTo}
        comment={comment}
        setComment={setComment}
        cancelReply={cancelReply}
        fetchDetailData={fetchPostDetail}
        type="market"
      />
    </main>
  );
};

export default CommunityMarketDetailPage;
