import { SVGProps } from "@/types/svg";

const BookMarkIcon = ({ className }: SVGProps) => {
  return (
    <svg
      className={className}
      fill="#000000"
      width="800px"
      height="800px"
      viewBox="0 0 32 32"
      version="1.1"
      strokeWidth="2"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>bookmark</title>
      <path d="M24 4v24l-8-8-8 8v-24h16z"></path>
    </svg>
  );
};

export default BookMarkIcon;
