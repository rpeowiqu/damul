import { useNavigate } from "react-router-dom";
import Feeds from "@/components/common/Feeds";
import DamulSearchBox from "@/components/common/DamulSearchBox";
import DamulButton from "@/components/common/DamulButton";
import WriteIcon from "@/components/svg/WriteIcon";

const CommunityMarketMainPage = () => {
  const navigate = useNavigate();

  return (
    <main className="h-full text-center px-4 py-6 pc:px-6 space-y-6">
      <DamulSearchBox
        placeholder="원하는 식자재를 검색해보세요."
        onInputClick={() => {
          navigate("/community/market/search");
        }}
      />
      <Feeds />
      <div className="absolute bottom-20 right-5">
        <DamulButton
          variant="round"
          px={3}
          onClick={() => {
            navigate("/community/market/post");
          }}
        >
          <WriteIcon />
        </DamulButton>
      </div>
    </main>
  );
};

export default CommunityMarketMainPage;
