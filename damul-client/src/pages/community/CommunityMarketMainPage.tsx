import { useNavigate } from "react-router-dom";
import FeedList from "@/components/common/FeedList";
import DamulSearchBox from "@/components/common/DamulSearchBox";
import PostButton from "@/components/community/PostButton";

const CommunityMarketMainPage = () => {
  const navigate = useNavigate();

  return (
    <main className="h-full text-center px-4 py-6 pc:px-6 space-y-6">
      <DamulSearchBox
        placeholder="원하는 식자재를 검색해보세요."
        onInputClick={() => {
          navigate("/community/market/search");
        }}
        className="cursor-pointer"
      />
      <FeedList />
      <PostButton to="market" />
    </main>
  );
};

export default CommunityMarketMainPage;
