import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useManageRecentSearches from "@/hooks/useManageRecentSearches";
import DamulSearchBox from "@/components/common/DamulSearchBox";
import RecentSearches from "@/components/common/RecentSearches";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CommunitySearchProps {
  placeholder: string;
  type: string;
}

const CommunitySearch = ({ placeholder, type }: CommunitySearchProps) => {
  const {
    recentSearches,
    handleAddSearch,
    handleRemoveSearch,
    handleRemoveSearchAll,
  } = useManageRecentSearches();
  const navigate = useNavigate();

  const [inputValue, setInputValue] = useState("");
  const [searchType, setSearchType] = useState("content");

  useEffect(() => {
    // console.log(searchType);
  }, [searchType]);

  return (
    <>
      <div className="flex justify-between gap-2">
        <div className="flex w-full justify-between gap-1">
          <Select
            value={searchType}
            onValueChange={(value) => setSearchType(value)}
          >
            <SelectTrigger className="w-24 pc:w-28 text-xs pc:text-sm">
              <SelectValue placeholder="검색 조건" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel className="text-xs pc:text-sm">
                  검색 조건
                </SelectLabel>
                <SelectItem
                  className="data-[highlighted]:bg-positive-50 data-[state=checked]:text-positive-500 text-xs pc:text-sm"
                  value="content"
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
                if (content.trim() === "") {
                  alert("앗! 검색어가 비어있어요. 검색어를 입력해 주세요. ✏️");
                  return;
                }
                handleAddSearch(content);
                navigate(
                  `/community/${type}/search/result?keyword=${encodeURIComponent(content)}&searchType=${searchType}`,
                );
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
        onSearch={(keyword) => {
          handleAddSearch(keyword);
          navigate(
            `/community/${type}/search/result?keyword=${encodeURIComponent(keyword)}&searchType=${searchType}`,
          );
        }}
      />
    </>
  );
};

export default CommunitySearch;
