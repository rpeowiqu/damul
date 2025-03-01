export const getRecentSearchKey = (pathname: string) => {
  if (pathname.endsWith("recipe/search")) {
    return "recentSearches_recipe";
  } else if (pathname.endsWith("market/search")) {
    return "recentSearches_market";
  } else if (pathname.endsWith("chatting/search")) {
    return "recentSearches_chatting";
  }

  return "";
};
