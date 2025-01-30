import { useNavigate } from "react-router-dom";
import useManageRecentSearches from "@/hooks/useManageRecentSearches";
import DamulSearchBox from "@/components/common/DamulSearchBox";
import RecentSearches from "@/components/common/RecentSearches";
import PostButton from "@/components/community/PostButton";
import DamulDropdown from "../common/DamulDropDown";

interface CommunitySearch {
  placeholder: string;
  title: string;
  postTo: string;
}

const CommunitySearch = ({ placeholder, title, postTo }: CommunitySearch) => {
  const {
    recentSearches,
    handleAddSearch,
    handleRemoveSearch,
    handleRemoveSearchAll,
  } = useManageRecentSearches();
  const navigate = useNavigate();

  return (
    <>
      <div className="flex justify-between gap-2">
        <DamulDropdown
          label="검색 조건"
          variant="normal-outline"
          items={[
            { label: "작성자", onClick: () => console.log("작성자 클릭") },
            {
              label: "제목+본문",
              onClick: () => console.log("제목+본문 클릭"),
            },
          ]}
        />
        <div className="flex-grow">
          <DamulSearchBox
            placeholder={placeholder}
            onButtonClick={(content) => {
              handleAddSearch(content);
              navigate(`${content}`);
            }}
          />
        </div>
      </div>
      <RecentSearches
        recentSearches={recentSearches}
        onRemoveSearch={handleRemoveSearch}
        onRemoveSearchAll={handleRemoveSearchAll}
        onSearch={(content) => {
          handleAddSearch(content);
          navigate(`${content}`);
        }}
      />
      <h3 className="px-2 font-semibold text-md">{title}</h3>
      <PostButton to={postTo} />
    </>
  );
};

export default CommunitySearch;
