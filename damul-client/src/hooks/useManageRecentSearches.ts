import { useState } from "react";
import { useLocation } from "react-router-dom";
import { getRecentSearchKey } from "@/utils/storage";

const useManageRecentSearches = () => {
  const { pathname } = useLocation();
  const storageKey = getRecentSearchKey(pathname);

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    // localStorage 초기값 가져오기
    const savedSearches = localStorage.getItem(storageKey);
    return savedSearches ? JSON.parse(savedSearches) : [];
  });

  // 검색어 추가
  const handleAddSearch = (searchTerm: string) => {
    if (!searchTerm) {
      return;
    }

    setRecentSearches((prevSearches) => {
      const updatedSearches = [
        searchTerm,
        ...prevSearches.filter((item) => item !== searchTerm),
      ].slice(0, 5);

      localStorage.setItem(storageKey, JSON.stringify(updatedSearches));
      return updatedSearches;
    });
  };

  // 검색어 삭제
  const handleRemoveSearch = (searchTerm: string) => {
    setRecentSearches((prevSearches) => {
      const updatedSearches = prevSearches.filter(
        (item) => item !== searchTerm,
      );
      localStorage.setItem(storageKey, JSON.stringify(updatedSearches));
      return updatedSearches;
    });
  };

  // 전체 삭제
  const handleRemoveSearchAll = () => {
    setRecentSearches([]);
    localStorage.removeItem(storageKey);
  };

  return {
    recentSearches,
    handleAddSearch,
    handleRemoveSearch,
    handleRemoveSearchAll,
  };
};

export default useManageRecentSearches;
