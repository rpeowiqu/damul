import CommunitySearch from "@/components/community/CommunitySearch";
import PostButton from "@/components/community/PostButton";
import WriteIcon from "@/components/svg/WriteIcon";
import DamulSection from "@/components/common/DamulSection";

const CommunityMarketSearchPage = () => {
  return (
    <div>
      <DamulSection>
        <CommunitySearch
          placeholder="원하는 식자재를 검색해보세요."
          type="market"
        />
      </DamulSection>

      <PostButton
        to="/community/market/post"
        icon={<WriteIcon className="scale-150 fill-positive-300" />}
      />
    </div>
  );
};

export default CommunityMarketSearchPage;
