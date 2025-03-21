import { SVGProps } from "@/types/svg";

const CheckCircleIcon = ({ className }: SVGProps) => {
  return (
    <svg
      className={className}
      width="800px"
      height="800px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className={className}
        cx="12"
        cy="12"
        r="10"
        stroke="#1C274C"
        strokeWidth="1.5"
      />
      <path
        className={className}
        d="M8.5 12.5L10.5 14.5L15.5 9.5"
        stroke="#1C274C"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CheckCircleIcon;
