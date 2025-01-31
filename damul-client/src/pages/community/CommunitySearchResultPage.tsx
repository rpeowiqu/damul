import { useNavigate, useParams } from "react-router-dom";
import FeedList from "@/components/common/FeedList";
import DamulSearchBox from "@/components/common/DamulSearchBox";

const CommunitySearchResultPage = () => {
  const navigate = useNavigate();
  const { keyword } = useParams<{ keyword: string }>();

  return (
    <main className="h-full px-4 py-6 pc:px-6 space-y-6">
      <div className="flex justify-between gap-2">
        <div className="flex-grow">
          <DamulSearchBox
            placeholder={keyword}
            onInputClick={() => {
              navigate("/community/market/search");
            }}
          />
        </div>
      </div>
      <FeedList />
    </main>
  );
};

export default CommunitySearchResultPage;
