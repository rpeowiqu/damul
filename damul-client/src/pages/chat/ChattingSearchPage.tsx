import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DamulSearchBox from "@/components/common/DamulSearchBox";
import RecentSearches from "@/components/common/RecentSearches";
import useManageRecentSearches from "@/hooks/useManageRecentSearches";
import PostButton from "@/components/community/PostButton";
import PlusIcon from "@/components/svg/PlusIcon";

const ChattingSearchPage = () => {
  const [inputValue, setInputValue] = useState("");
  const {
    recentSearches,
    handleAddSearch,
    handleRemoveSearch,
    handleRemoveSearchAll,
  } = useManageRecentSearches();

  const navigate = useNavigate();

  return (
    <main className="h-full px-4 py-6 pc:px-6 space-y-6">
      <div className="flex-grow">
        <DamulSearchBox
          placeholder="채팅방 검색"
          onButtonClick={(content) => {
            handleAddSearch(content);
            navigate(`${content}`);
          }}
          inputValue={inputValue}
          setInputValue={setInputValue}
        />
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
      <PostButton to="/chatting/create" icon={<PlusIcon />} />
    </main>
  );
};

export default ChattingSearchPage;
