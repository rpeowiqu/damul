import BookMarkIcon from "../svg/BookMarkIcon";

interface RecipeHeaderProps {
  title: string;
  createdAt: string;
  type: string;
  status?: string;
  isBookmarked?: boolean;
}
const CommunityDetailHeader = ({
  title,
  createdAt,
  type,
  status,
  isBookmarked,
}: RecipeHeaderProps) => {
  const StatusMarker = () =>
    status === "ACTIVE" ? (
      <div className="flex content-center bg-positive-200 text-xs py-0.5 px-2 rounded-full">
        모집중
      </div>
    ) : (
      <div className="flex content-center bg-negative-200 text-xs py-0.5 px-2 rounded-full">
        모집완료
      </div>
    );

  return (
    <div className="flex justify-between p-2 border-b border-neutral-300">
      <div className="text-start">
        {type === "recipe" ? (
          <p className="text-sm text-neutral-600">레시피 게시판</p>
        ) : (
          <p className="text-sm text-neutral-600">공구/나눔 게시판</p>
        )}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      {type === "recipe" ? (
        <div className="flex flex-col justify-between items-end py-0.5 cursor-pointer">
          {isBookmarked ? (
            <BookMarkIcon className="w-5 h-5 fill-positive-300 stroke-positive-300" />
          ) : (
            <BookMarkIcon className="w-5 h-5 stroke-positive-300   " />
          )}
          <p className="text-xs text-neutral-500">{createdAt}</p>
        </div>
      ) : (
        <div className="flex flex-col justify-end items-end py-0.5">
          <StatusMarker />
          <p className="text-xs text-neutral-500">{createdAt}</p>
        </div>
      )}
    </div>
  );
};

export default CommunityDetailHeader;
