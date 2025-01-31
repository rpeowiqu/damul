import Image from "./Image";

interface FeedCardProps {
  title?: string;
  description?: string;
  date?: string;
  author?: string;
  image?: string;
}

const FeedCard = ({
  title,
  description,
  date,
  author,
  image,
}: FeedCardProps) => (
  <div className="flex h-24 pc:h-28 border-2 border-positive-200 hover:bg-positive-50 hover:shadow-inner active:border-positive-500 rounded-lg">
    <Image src={image} alt="썸네일 이미지" className="rounded-s-lg" />
    <div className="flex flex-col justify-between flex-1 px-2 py-1 pc:px-4 pc:py-2 cursor-pointer">
      <div className="text-left">
        <h3 className="font-bold text-md">{title}</h3>
        <p className="text-xs pc:text-sm line-clamp-2">{description}</p>
      </div>
      <div className="flex justify-between pt-2 text-xxs pc:text-xs text-normal-500">
        <span>{date}</span>
        <span>{author}</span>
      </div>
    </div>
  </div>
);

export default FeedCard;
