import Image from "../common/Image";

interface ContentSectionProps {
  contentImageUrl: string;
  content: string;
  type: string;
}
const ContentSection = ({
  contentImageUrl,
  content,
  type,
}: ContentSectionProps) => {
  return (
    <>
      {contentImageUrl && (
        <Image src={contentImageUrl} className="w-auto h-auto rounded-lg" />
      )}
      <div className="py-3 text-start">
        {type === "recipe" ? (
          <>
            <h3 className="p-3 text-lg font-semibold">소개</h3>
            <div className="p-3 bg-neutral-100 text-sm pc:text-md whitespace-pre-wrap">
              {content}
            </div>
          </>
        ) : (
          <div className="py-3 px-1 text-sm pc:text-md whitespace-pre-wrap">
            {content}
          </div>
        )}
      </div>
    </>
  );
};

export default ContentSection;
