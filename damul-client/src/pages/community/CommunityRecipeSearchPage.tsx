import CommunitySearch from "@/components/community/CommunitySearch";
import DamulCarousel from "@/components/common/DamulCarousel";

const CommunityRecipeSearchPage = () => {
  return (
    <main className="h-full px-4 py-6 pc:px-6 space-y-6">
      <CommunitySearch
        placeholder="찾고 싶은 레시피를 검색해보세요"
        title="인기 급상승 레시피"
        postTo="recipe"
      />
      <DamulCarousel />
    </main>
  );
};

export default CommunityRecipeSearchPage;
