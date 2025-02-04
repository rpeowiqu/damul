import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useManageRecentSearches from "@/hooks/useManageRecentSearches";
import DamulSearchBox from "@/components/common/DamulSearchBox";
import RecentSearches from "@/components/common/RecentSearches";
import PostButton from "@/components/community/PostButton";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [sortType, setSortType] = useState("title");

  return (
    <>
      <div className="flex justify-between gap-2">
        <div className="flex w-full justify-between gap-1">
          <Select
            value={sortType}
            onValueChange={(value) => setSortType(value)}
          >
            <SelectTrigger className="w-24 pc:w-28 text-xs pc:text-sm">
              <SelectValue placeholder="정렬 방식" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel className="text-xs pc:text-sm">검색 조건</SelectLabel>
                <SelectItem
                  className="data-[highlighted]:bg-positive-50 data-[state=checked]:text-positive-500 text-xs pc:text-sm"
                  value="title"
                >
                  제목+내용
                </SelectItem>
                <SelectItem
                  className="data-[highlighted]:bg-positive-50 data-[state=checked]:text-positive-500 text-xs pc:text-sm"
                  value="author"
                >
                  작성자
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
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
