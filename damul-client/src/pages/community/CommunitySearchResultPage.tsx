import { useNavigate, useParams } from "react-router-dom";
import Feeds from "@/components/common/Feeds";
import DamulSearchBox from "@/components/common/DamulSearchBox";
import DamulDropdown from "@/components/common/DamulDropDown";

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
        <DamulDropdown
          label="검색 조건"
          variant="normal-outline"
          items={[
            { label: "최신순", onClick: () => console.log("작성자 클릭") },
            {
              label: "좋아요 많은순",
              onClick: () => console.log("제목+본문 클릭"),
            },
            {
              label: "좋아요 적은순",
              onClick: () => console.log("제목+본문 클릭"),
            },
            {
              label: "조회수 높은순",
              onClick: () => console.log("제목+본문 클릭"),
            },
          ]}
        />
      </div>
      <Feeds />
    </main>
  );
};

export default CommunitySearchResultPage;
