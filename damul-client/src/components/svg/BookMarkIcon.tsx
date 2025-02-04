import { SVGProps } from "@/types/svg";

const BookMarkIcon = ({ className }: SVGProps) => {
  return (
    <svg
      className={`${className}`}
      width="20"
      height="20"
      viewBox="0 0 15 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className={`${className}`}
        d="M15.8327 17.5L9.99935 13.3333L4.16602 17.5V4.16667C4.16602 3.72464 4.34161 3.30072 4.65417 2.98816C4.96673 2.67559 5.39065 2.5 5.83268 2.5H14.166C14.608 2.5 15.032 2.67559 15.3445 2.98816C15.6571 3.30072 15.8327 3.72464 15.8327 4.16667V17.5Z"
        stroke="#1E1E1E"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default BookMarkIcon;
