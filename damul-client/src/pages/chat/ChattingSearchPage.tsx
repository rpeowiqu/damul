import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DamulSearchBox from "@/components/common/DamulSearchBox";
import RecentSearches from "@/components/common/RecentSearches";
import useManageRecentSearches from "@/hooks/useManageRecentSearches";
import PostButton from "@/components/community/PostButton";
import DamulSection from "@/components/common/DamulSection";
import WriteIcon from "@/components/svg/WriteIcon";

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
    <div>
      <DamulSection>
        <DamulSearchBox
          placeholder="채팅방 검색"
          onButtonClick={(content) => {
            handleAddSearch(content);
            navigate(`/chatting/search/result?keyword=${content}`);
          }}
          inputValue={inputValue}
          setInputValue={setInputValue}
        />

        <RecentSearches
          recentSearches={recentSearches}
          onRemoveSearch={handleRemoveSearch}
          onRemoveSearchAll={handleRemoveSearchAll}
          onSearch={(content) => {
            handleAddSearch(content);
            navigate(`/chatting/search/result?keyword=${content}`);
          }}
        />
      </DamulSection>

      <PostButton
        to="/chatting/create"
        icon={<WriteIcon className="scale-150 fill-positive-300" />}
      />
    </div>
  );
};

export default ChattingSearchPage;
