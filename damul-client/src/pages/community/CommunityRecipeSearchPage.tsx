import DamulSection from "@/components/common/DamulSection";
import CommunitySearch from "@/components/community/CommunitySearch";
import PopularRecipeCarousel from "@/components/community/PopularRecipeCarousel";
import PostButton from "@/components/community/PostButton";
import WriteIcon from "@/components/svg/WriteIcon";

const CommunityRecipeSearchPage = () => {
  return (
    <div>
      <DamulSection>
        <CommunitySearch
          placeholder="찾고 싶은 레시피를 검색해보세요"
          type="recipe"
        />
        <h3 className="px-2 font-semibold text-md">인기 급상승 레시피</h3>
        <PopularRecipeCarousel />
      </DamulSection>

      <PostButton
        to="/community/recipe/post"
        icon={<WriteIcon className="scale-150 fill-positive-300" />}
      />
    </div>
  );
};

export default CommunityRecipeSearchPage;
