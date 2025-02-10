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
  bookmarked: boolean;
  liked: boolean;
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
    bookmarked: false,
    liked: false,
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
      <main
        className={`relative flex flex-col justify-center w-full text-center p-6 ${
          replyingTo ? "pc:pb-24" : "pc:pb-6"
        } mb-8`}
      >
        <CommunityDetailHeader
          title={data.title}
          createdAt={data.createdAt}
          bookmarked={data.bookmarked}
          recipeId={data.recipeId}
          type="recipe"
        />
        <AuthorInfo
          profileImageUrl={data.profileImageUrl}
          authorName={data.authorName}
          viewCnt={data.viewCnt}
          likeCnt={data.likeCnt}
          liked={data.liked}
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
          recipeId={data.recipeId}
          comments={data.comments}
          onReply={(comment) => setReplyingTo(comment)}
          type="recipe"
          fetchRecipeDetail={fetchRecipeDetail}
        />
      </main>
      <FixedCommentInput
        recipeId={recipeId || ""}
        replyingTo={replyingTo}
        setReplyingTo={setReplyingTo}
        comment={comment}
        setComment={setComment}
        cancelReply={cancelReply}
        fetchRecipeDetail={fetchRecipeDetail}
      />
    </div>
  );
};

export default CommunityRecipeDetailPage;
