import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CommunityDetailHeader from "@/components/community/CommunityDetailHeader";
import AuthorInfo from "@/components/community/AuthorInfo";
import ContentSection from "@/components/community/ContentSection";
import IngredientsSection from "@/components/community/IngredientsSection";
import CookingOrdersSection from "@/components/community/CookingOrderSection";
import CommentsSection from "@/components/community/CommentsSection";
import FixedCommentInfo from "@/components/community/FixedCommentInfo";
import { getRecipeDetail } from "@/service/recipe";
import { RecipeDetail, Comment } from "@/types/community";
import DamulSection from "@/components/common/DamulSection";

const CommunityRecipeDetailPage = () => {
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [comment, setComment] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
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
      setIsLoading(true);
      const response = await getRecipeDetail(recipeId);
      // console.log(response);
      setData(response?.data);
    } catch (error) {
      // console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipeDetail();
  }, []);

  const cancelReply = () => {
    setReplyingTo(null);
  };

  return (
    <div className={`flex flex-col gap-3 ${replyingTo ? "pb-28" : "pb-14"}`}>
      <DamulSection>
        <CommunityDetailHeader
          title={data.title}
          createdAt={data.createdAt}
          bookmarked={data.bookmarked}
          id={data.recipeId}
          isLoading={isLoading}
          type="recipe"
        />
        <AuthorInfo
          profileImageUrl={data.profileImageUrl}
          authorName={data.authorName}
          authorId={data.authorId}
          viewCnt={data.viewCnt}
          likeCnt={data.likeCnt}
          liked={data.liked}
          id={data.recipeId}
          isLoading={isLoading}
          type="recipe"
        />
        <ContentSection
          contentImageUrl={data.contentImageUrl}
          content={data.content}
          type="recipe"
          isLoading={isLoading}
        />
        <IngredientsSection
          ingredients={data.ingredients}
          isLoading={isLoading}
        />
        <CookingOrdersSection
          cookingOrders={data.cookingOrders}
          isLoading={isLoading}
        />
      </DamulSection>
      <DamulSection>
        <CommentsSection
          id={data.recipeId}
          comments={data.comments}
          onReply={(comment) => setReplyingTo(comment)}
          type="recipe"
          fetchDetailData={fetchRecipeDetail}
        />
      </DamulSection>
      <FixedCommentInfo
        id={recipeId || ""}
        replyingTo={replyingTo}
        setReplyingTo={setReplyingTo}
        comment={comment}
        setComment={setComment}
        cancelReply={cancelReply}
        fetchDetailData={fetchRecipeDetail}
        type="recipe"
      />
    </div>
  );
};

export default CommunityRecipeDetailPage;
