import { useState } from "react";
import CommunityDetailHeader from "@/components/community/CommunityDetailHeader";
import AuthorInfo from "@/components/community/AuthorInfo";
import ContentSection from "@/components/community/ContentSection";
import CommentsSection from "@/components/community/CommentsSection";
import FixedCommentInfo from "@/components/community/FixedCommentInfo";
import { Comment } from "@/types/community";

const CommunityMarketDetailPage = () => {
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [comment, setComment] = useState<string>("");

  const mockData = {
    id: 1,
    title: "토마토 공구하실 분",
    authorId: 1,
    authorName: "토마토러버전종우",
    profileImageUrl: "string",
    status: "ACTIVE",
    contentImageUrl: "string",
    content:
      "토마토 먹어요 토마토 먹어요 토마토 먹어요 토마토 먹어요 토마토 먹어요  먹어요 토마토 먹어요  먹어요 토마토 먹어요  먹어요 토마토 먹어요  먹어요 토마토 먹어요  먹어요 토마토 먹어요  먹어요 토마토 먹어요  먹어요 토마토 먹어요  먹어요 토마토 먹어요  먹어요 토마토 먹어요  먹어요 토마토 먹어요",
    createdAt: "2024-02-02 23:22",
    currentMemberNum: 2, // 이거
    maxMemberSize: 13, // 이거
    commentCnt: 122,
    comments: [
      {
        id: 1,
        userId: 1,
        nickname: "요리사서히",
        profileImageUrl: "string",
        comment:
          "우와 맛있겠당 우와 맛있겠당 우와 맛있겠당 우와 맛있겠당 우와 맛있겠당 우와 맛있겠당",
        createdAt: "2025-01-29",
      },
      {
        id: 2,
        userId: 2,
        nickname: "토마토러버전종우",
        profileImageUrl: "string",
        comment: "인정하는 부분",
        parentId: 1,
        createdAt: "2025-01-30",
      },
      {
        id: 3,
        userId: 1,
        nickname: "요리사서히",
        profileImageUrl: "string",
        comment:
          "우와 맛있겠당 우와 맛있겠당 우와 맛있겠당 우와 맛있겠당 우와 맛있겠당 우와 맛있겠당",
        createdAt: "2025-01-29",
      },
      {
        id: 4,
        userId: 2,
        nickname: "토마토러버전종우",
        profileImageUrl: "string",
        comment: "인정하는 부분",
        parentId: 1,
        createdAt: "2025-01-30",
      },
    ],
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  return (
    <div className="flex">
      <main className="relative flex flex-col justify-center w-full text-center p-5 pc:p-6 mb-12">
        <CommunityDetailHeader
          title={mockData.title}
          createdAt={mockData.createdAt}
          status={mockData.status}
          type="market"
        />
        <AuthorInfo
          profileImageUrl={mockData.profileImageUrl}
          authorName={mockData.authorName}
          id={mockData.id}
          type="market"
        />
        <ContentSection
          contentImageUrl={mockData.contentImageUrl}
          content={mockData.content}
          type="market"
        />
        <CommentsSection
          comments={mockData.comments}
          onReply={(comment) => setReplyingTo(comment)}
          currentMemberNum={mockData.currentMemberNum}
          maxMemberSize={mockData.maxMemberSize}
          type="market"
        />
      </main>
      <FixedCommentInfo
        replyingTo={replyingTo}
        comment={comment}
        setComment={setComment}
        cancelReply={cancelReply}
      />
    </div>
  );
};

export default CommunityMarketDetailPage;
