import { useNavigate } from "react-router-dom";
import Feeds from "@/components/common/Feeds";
import DamulSearchBox from "@/components/common/DamulSearchBox";
import DamulButton from "@/components/common/DamulButton";
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
      />
      <Feeds />
      <div className="absolute bottom-20 right-5">
        <DamulButton
          variant="round"
          px={3}
          onClick={() => {
            navigate("/community/recipe/post");
          }}
        >
          <WriteIcon />
        </DamulButton>
      </div>
    </main>
  );
};

export default CommunityRecipeMainPage;
