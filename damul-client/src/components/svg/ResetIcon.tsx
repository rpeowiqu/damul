import { SVGProps } from "@/types/svg";

const ResetIcon = ({ className }: SVGProps) => {
  return (
    <svg
      width="88px"
      height="88px"
      viewBox="0 0 21.00 21.00"
      xmlns="http://www.w3.org/2000/svg"
      fill="#000000"
      stroke="#000000"
      strokeWidth="2.1"
      transform="rotate(0)"
      className={className}
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0" />

      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#CCCCCC"
        strokeWidth="0.126"
      />

      <g id="SVGRepo_iconCarrier">
        <g
          fill="none"
          fillRule="evenodd"
          stroke="#000000"
          strokeLinecap="round"
          strokeLinejoin="round"
          transform="matrix(0 1 1 0 2.5 2.5)"
          className={className}
        >
          <path d="m3.98652376 1.07807068c-2.38377179 1.38514556-3.98652376 3.96636605-3.98652376 6.92192932 0 4.418278 3.581722 8 8 8s8-3.581722 8-8-3.581722-8-8-8" />{" "}
          <path d="m4 1v4h-4" transform="matrix(1 0 0 -1 0 6)" />
        </g>
      </g>
    </svg>
  );
};

export default ResetIcon;
