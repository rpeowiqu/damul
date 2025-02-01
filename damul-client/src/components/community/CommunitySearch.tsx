import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useManageRecentSearches from "@/hooks/useManageRecentSearches";
import DamulSearchBox from "@/components/common/DamulSearchBox";
import RecentSearches from "@/components/common/RecentSearches";
import PostButton from "@/components/community/PostButton";

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

  const [inputValue, setInputValue] = useState("");

  return (
    <>
      <div className="flex justify-between gap-2">
        <div className="flex-grow">
          <DamulSearchBox
            placeholder={placeholder}
            onButtonClick={(content) => {
              handleAddSearch(content);
              navigate(`${content}`);
            }}
            inputValue={inputValue}
            setInputValue={setInputValue}
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
