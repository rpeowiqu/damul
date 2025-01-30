import RecentSearchBubble from "./RecentSearchBubble";
import AlertCircleIcon from "../svg/AlertCircleIcon";

interface RecentSearchesProps {
  recentSearches: string[];
  onRemoveSearch: (_searchTerm: string) => void;
  onRemoveSearchAll: () => void;
  onSearch: (_searchTerm: string) => void;
}

const RecentSearchEmptyState = () => (
  <>
    <div className="flex justify-between items-center">
      <h3 className="font-semibold text-md">최근 검색어</h3>
    </div>
    <div className="flex justify-center gap-3 py-5">
      <AlertCircleIcon className="stroke-normal-400" />
      <p>최근 검색어가 없습니다</p>
    </div>
  </>
);

const RecentSearches = ({
  recentSearches,
  onRemoveSearch,
  onRemoveSearchAll,
  onSearch,
}: RecentSearchesProps) => {
  return (
    <div className="flex flex-col text-start px-2">
      {(recentSearches && recentSearches.length > 0) ? (
        <>
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-md">최근 검색어</h3>
            <p className="text-sm" onClick={onRemoveSearchAll}>
              전체 삭제
            </p>
          </div>
          <div className="flex flex-wrap gap-3 py-4">
            {recentSearches.map((item, index) => (
              <RecentSearchBubble
                key={index}
                content={item}
                onRemove={onRemoveSearch}
                onSearch={onSearch}
              />
            ))}
          </div>
        </>
      ) : (
        <RecentSearchEmptyState />
      )}
    </div>
  );
};

export default RecentSearches;
