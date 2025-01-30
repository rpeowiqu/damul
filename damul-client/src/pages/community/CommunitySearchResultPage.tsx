import { useNavigate, useParams } from "react-router-dom";
import Feeds from "@/components/common/Feeds";
import DamulSearchBox from "@/components/common/DamulSearchBox";

const CommunitySearchResultPage = () => {
  const navigate = useNavigate();
  const { keyword } = useParams<{ keyword: string }>();

  return (
    <main className="h-full px-4 py-6 pc:px-6 space-y-6">
      <DamulSearchBox
        placeholder={keyword}
        onInputClick={() => {
          navigate("/community/market/search");
        }}
      />
      <Feeds />
    </main>
  );
};

export default CommunitySearchResultPage;
