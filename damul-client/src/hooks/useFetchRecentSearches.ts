import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getRecentSearchKey } from "@/utils/storage";

const useFetchRecentSearches = () => {
  const location = useLocation();
  const { pathname } = location;

  const storageKey = getRecentSearchKey(pathname);

  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    const savedSearches = localStorage.getItem(storageKey);
    setRecentSearches(savedSearches ? JSON.parse(savedSearches) : []);
  }, [storageKey]);

  return recentSearches;
};

export default useFetchRecentSearches;
