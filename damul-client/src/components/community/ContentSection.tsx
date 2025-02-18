import Skeleton from "react-loading-skeleton";
import Image from "../common/Image";

interface RecipeHeaderProps {
  type: string;
  isLoading?: boolean;
  contentImageUrl?: string;
  content?: string;
}
const CommunityDetailHeader = ({
  type,
  contentImageUrl,
  content,
  isLoading,
}: RecipeHeaderProps) => {
  if (isLoading) {
    return (
      <>
        {type === "recipe" ? (
          <div className="flex flex-col text-start">
            <Skeleton width="100%" height={250} />
            <Skeleton width={60} height={20} className="mt-5 mb-3" />
            <Skeleton width="100%" height={80} />
          </div>
        ) : (
          <div className="flex flex-col text-start gap-3">
            <Skeleton width="100%" height={250} />
            <Skeleton width="100%" height={80} />
          </div>
        )}
      </>
    );
  }

  return (
    <>
      {contentImageUrl && (
        <Image src={contentImageUrl} className="w-auto h-auto rounded-lg" />
      )}
      <div className="py-3 text-start">
        {type === "recipe" ? (
          <>
            <h3 className="p-3 text-md pc:text-lg font-semibold">소개</h3>
            <div className="p-3 bg-neutral-100 text-sm pc:text-md whitespace-pre-wrap break-words break-all">
              {content}
            </div>
          </>
        ) : (
          <div className="py-3 px-1 text-sm pc:text-md whitespace-pre-wrap whitespace-pre-wrap break-words break-all">
            {content}
          </div>
        )}
      </div>
    </>
  );
};

export default CommunityDetailHeader;
