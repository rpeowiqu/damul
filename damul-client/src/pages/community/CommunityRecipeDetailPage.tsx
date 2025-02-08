import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CommunityDetailHeader from "@/components/community/CommunityDetailHeader";
import AuthorInfo from "@/components/community/AuthorInfo";
import ContentSection from "@/components/community/ContentSection";
import IngredientsSection from "@/components/community/IngredientsSection";
import CookingOrdersSection from "@/components/community/CookingOrderSection";
import CommentsSection from "@/components/community/CommentsSection";
import FixedCommentInput from "@/components/community/FixedCommentInfo";
import { getRecipeDetail } from "@/service/recipe";

interface Ingredient {
  id: number;
  name: string;
  amount: string;
  unit: string;
}

interface CookingOrder {
  id: number;
  content: string;
  imageUrl: string;
}

interface Comment {
  id: number;
  userId: number;
  nickname: string;
  profileImageUrl: string;
  comment: string;
  createdAt: string;
  parentId?: number;
}

interface RecipeDetail {
  recipeId: string;
  title: string;
  isBookmarked: boolean;
  isLiked: boolean;
  createdAt: string;
  authorId: number;
  authorName: string;
  profileImageUrl: string;
  viewCnt: number;
  likeCnt: number;
  content: string;
  contentImageUrl: string;
  ingredients: Ingredient[];
  cookingOrders: CookingOrder[];
  comments: Comment[];
}

const CommunityRecipeDetailPage = () => {
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [comment, setComment] = useState<string>("");
  const { recipeId } = useParams();

  const initialRecipeDetail: RecipeDetail = {
    recipeId: "0",
    title: "",
    isBookmarked: false,
    isLiked: false,
    createdAt: "",
    authorId: 0,
    authorName: "",
    profileImageUrl: "",
    viewCnt: 0,
    likeCnt: 0,
    content: "",
    contentImageUrl: "",
    ingredients: [],
    cookingOrders: [],
    comments: [],
  };

  const [data, setData] = useState<RecipeDetail>(initialRecipeDetail);

  const fetchRecipeDetail = async () => {
    try {
      const response = await getRecipeDetail(recipeId);
      console.log(response);
      setData(response?.data as RecipeDetail);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRecipeDetail();
  }, []);

  const cancelReply = () => {
    setReplyingTo(null);
  };

  return (
    <div className="flex">
      <main className="relative flex flex-col justify-center w-full text-center p-5 pc:p-6 mb-12">
        <CommunityDetailHeader
          title={data.title}
          createdAt={data.createdAt}
          isBookmarked={data.isBookmarked}
          type="recipe"
        />
        <AuthorInfo
          profileImageUrl={data.profileImageUrl}
          authorName={data.authorName}
          viewCnt={data.viewCnt}
          likeCnt={data.likeCnt}
          isLiked={data.isLiked}
          recipeId={data.recipeId}
          type="recipe"
        />
        <ContentSection
          contentImageUrl={data.contentImageUrl}
          content={data.content}
          type="recipe"
        />
        <IngredientsSection ingredients={data.ingredients} />
        <CookingOrdersSection cookingOrders={data.cookingOrders} />
        <CommentsSection
          comments={data.comments}
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
