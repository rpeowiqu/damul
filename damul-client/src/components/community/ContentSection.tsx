import Image from "../common/Image";

interface ContentSectionProps {
    contentImageUrl: string;
    content: string;
  }
  const ContentSection = ({
    contentImageUrl,
    content,
  }: ContentSectionProps) => {
    return (
      <>
        <Image
          src={contentImageUrl}
          className="w-full h-52 object-cover rounded-lg"
        />
        <div className="py-3 text-start">
          <h3 className="p-3 text-lg font-semibold">소개</h3>
          <div className="p-3 bg-neutral-100">{content}</div>
        </div>
      </>
    );
  };

export default ContentSection;
