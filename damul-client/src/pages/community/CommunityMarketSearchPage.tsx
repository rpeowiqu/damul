import CommunitySearch from "@/components/community/CommunitySearch";
import DamulCarousel from "@/components/common/DamulCarousel";
import PostButton from "@/components/community/PostButton";
import WriteIcon from "@/components/svg/WriteIcon";

const CommunityMarketSearchPage = () => {
  return (
    <main className="h-full px-4 py-6 pc:px-6 space-y-6">
      <CommunitySearch
        placeholder="원하는 식자재를 검색해보세요."
        title="인기 급상승 게시글"
        postTo="market"
      />
      <DamulCarousel />
      <PostButton to="/community/market/post" icon={<WriteIcon/>}/>
    </main>
  );
};

export default CommunityMarketSearchPage;
