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
      <Image
        src={contentImageUrl}
        className="w-full h-52 object-cover rounded-lg"
      />
      <div className="py-3 text-start">
        {type === "recipe" ? (
          <>
            <h3 className="p-3 text-lg font-semibold">소개</h3>
            <div className="p-3 bg-neutral-100 text-sm pc:text-md">{content}</div>
          </>
        ) : (
          <div className="py-3 px-1">{content}</div>
        )}
      </div>
    </>
  );
};

export default ContentSection;
