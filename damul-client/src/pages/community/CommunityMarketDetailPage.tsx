import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CommunityDetailHeader from "@/components/community/CommunityDetailHeader";
import AuthorInfo from "@/components/community/AuthorInfo";
import ContentSection from "@/components/community/ContentSection";
import CommentsSection from "@/components/community/CommentsSection";
import FixedCommentInfo from "@/components/community/FixedCommentInfo";
import { getPostDetail } from "@/service/market";

interface Comment {
  id: number;
  userId: number;
  nickname: string;
  profileImageUrl: string;
  comment: string;
  createdAt: string;
  parentId?: number;
}

interface PostDetail {
  id: string;
  title: string;
  authorId: number;
  authorName: string;
  profileImageUrl: string;
  status: "ACTIVE" | "COMPLETED";
  contentImageUrl: string;
  content: string;
  createdAt: string;
  currentChatNum: number;
  chatSize: number;
  viewCnt: number;
  comments: Comment[];
}

const CommunityMarketDetailPage = () => {
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [comment, setComment] = useState<string>("");
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
    chatSize: 0,
    viewCnt: 0,
    comments: [],
  };

  const [data, setData] = useState<PostDetail>(initialPostDetail);

  const fetchPostDetail = async () => {
    const response = await getPostDetail(postId);
    console.log(response);
    setData(response?.data as PostDetail);
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
        type="market"
      />
      <AuthorInfo
        profileImageUrl={data.profileImageUrl}
        authorName={data.authorName}
        viewCnt={data.viewCnt}
        type="market"
      />
      <ContentSection
        contentImageUrl={data.contentImageUrl}
        content={data.content}
        type="market"
      />
      <CommentsSection
        id={data.id}
        comments={data.comments}
        onReply={(comment) => setReplyingTo(comment)}
        currentChatNum={data.currentChatNum}
        chatSize={data.chatSize}
        fetchDetailData={fetchPostDetail}
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
