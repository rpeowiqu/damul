import { useNavigate } from "react-router-dom";
import FeedList from "@/components/common/FeedList";
import DamulSearchBox from "@/components/common/DamulSearchBox";
import PostButton from "@/components/community/PostButton";
import WriteIcon from "@/components/svg/WriteIcon";

const CommunityRecipeMainPage = () => {
  const navigate = useNavigate();

  return (
    <main className="h-full text-center px-4 py-6 pc:px-6 space-y-6">
      <DamulSearchBox
        placeholder="찾고 싶은 레시피를 검색해보세요."
        onInputClick={() => {
          navigate("/community/recipe/search");
        }}
        className="cursor-pointer"
      />
      <FeedList />
      <PostButton to="/community/recipe/post" icon={<WriteIcon/>}/>
    </main>
  );
};

export default CommunityRecipeMainPage;
