interface RecentSearchBubbleProps {
  content: string;
  onRemove: (_searchTerm: string) => void;
  onSearch: (_searchTerm: string) => void;
}

const RecentSearchBubble = ({
  content,
  onRemove,
  onSearch,
}: RecentSearchBubbleProps) => {

  return (
    <span className="inline-flex bg-normal-100 px-3 py-1 rounded-full gap-3 text-sm">
      <span
        onClick={() => {
          onSearch(content);
        }}
      >
        {content}
      </span>
      <span
        onClick={() => {
          onRemove(content);
        }}
      >
        X
      </span>
    </span>
  );
};

export default RecentSearchBubble;
