export const getRecentSearchKey = (pathname: string) => {
  return pathname.endsWith("recipe/search")
    ? "recentSearches_recipe"
    : "recentSearches_market";
};
