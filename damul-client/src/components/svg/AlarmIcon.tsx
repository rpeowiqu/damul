import { SVGProps } from "@/types/svg";

const AlarmIcon = ({ className }: SVGProps) => {
  return (
    <svg
      className={className}
      viewBox="0 0 19 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_183_31999)">
        <path
          className={className}
          d="M10.7975 18.3587C10.6656 18.6113 10.4764 18.8209 10.2487 18.9667C10.021 19.1124 9.76278 19.1891 9.5 19.1891C9.23722 19.1891 8.97904 19.1124 8.75133 18.9667C8.52362 18.8209 8.33436 18.6113 8.2025 18.3587M14 7.52539C14 6.19931 13.5259 4.92754 12.682 3.98986C11.8381 3.05217 10.6935 2.52539 9.5 2.52539C8.30653 2.52539 7.16193 3.05217 6.31802 3.98986C5.47411 4.92754 5 6.19931 5 7.52539C5 13.3587 2.75 15.0254 2.75 15.0254H16.25C16.25 15.0254 14 13.3587 14 7.52539Z"
          stroke="#000000"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export default AlarmIcon;
