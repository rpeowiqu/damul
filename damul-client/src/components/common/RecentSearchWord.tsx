interface RecentSearchWordProps {
  content: string;
  onRemove: (_searchTerm: string) => void;
  onSearch: (_searchTerm: string) => void;
}

const RecentSearchWord = ({
  content,
  onRemove,
  onSearch,
}: RecentSearchWordProps) => {
  return (
    <span className="inline-flex bg-normal-100 px-3 py-1 rounded-full gap-3 text-sm">
      <span
        onClick={() => {
          onSearch(content);
        }}
        className="cursor-pointer"
      >
        {content}
      </span>
      <span
        onClick={() => {
          onRemove(content);
        }}
        className="cursor-pointer"
      >
        X
      </span>
    </span>
  );
};

export default RecentSearchWord;
