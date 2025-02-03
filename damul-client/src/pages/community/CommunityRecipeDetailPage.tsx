import { useState } from "react";
import CommunityDetailHeader from "@/components/community/CommunityDetailHeader";
import AuthorInfo from "@/components/community/AuthorInfo";
import ContentSection from "@/components/community/ContentSection";
import IngredientsSection from "@/components/community/IngredientsSection";
import CookingOrdersSection from "@/components/community/CookingOrderSection";
import CommentsSection from "@/components/community/CommentsSection";
import FixedCommentInput from "@/components/community/FixedCommentInfo";
import { Comment } from "@/types/community";

const CommunityRecipeDetailPage = () => {
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [comment, setComment] = useState<string>("");

  const mockData = {
    id: 1,
    title: "일본 현지 돈가스 만들기",
    isBookmarked: true,
    isLiked: false,
    createdAt: "2024-01-19 23:23",
    authorId: 2,
    authorName: "요리사서히",
    profileImageUrl: "string",
    viewCnt: 152,
    likeCnt: 32,
    content:
      "돈가스는 오스트리아의 슈니첼을 원형으로, 서양의 커틀릿에서 유래한 일본 요리입니다. 돈가스는 오스트리아의 슈니첼을 원형으로, 서양의 커틀릿에서 유래한 일본 요리입니다.",
    contentImageUrl: "string",
    ingredients: [
      { id: 1, name: "당근", amount: "1/2", unit: "개" },
      { id: 2, name: "상추", amount: "100", unit: "g" },
      { id: 3, name: "진간장", amount: "2", unit: "T" },
    ],
    cookingOrders: [
      { id: 1, content: "당근 준비하숑", imageUrl: "string" },
      { id: 2, content: "당근을 자릅니다", imageUrl: "string" },
      { id: 3, content: "당근을 볶아요 아주그냥 볶아요", imageUrl: "string" },
    ],
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
          isBookmarked={mockData.isBookmarked}
          type="recipe"
        />
        <AuthorInfo
          profileImageUrl={mockData.profileImageUrl}
          authorName={mockData.authorName}
          viewCnt={mockData.viewCnt}
          likeCnt={mockData.likeCnt}
          isLiked={mockData.isLiked}
          id={mockData.id}
          type="recipe"
        />
        <ContentSection
          contentImageUrl={mockData.contentImageUrl}
          content={mockData.content}
          type="recipe"
        />
        <IngredientsSection ingredients={mockData.ingredients} />
        <CookingOrdersSection cookingOrders={mockData.cookingOrders} />
        <CommentsSection
          comments={mockData.comments}
          onReply={(comment) => setReplyingTo(comment)}
          type="recipe"
        />
      </main>
      <FixedCommentInput
        replyingTo={replyingTo}
        comment={comment}
        setComment={setComment}
        cancelReply={cancelReply}
      />
    </div>
  );
};

export default CommunityRecipeDetailPage;
