import { SVGProps } from "@/types/svg";

const TitleIcon = ({ className }: SVGProps) => {
  return (
    <svg
      className={`${className}`}
      width="800px"
      height="800px"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className={`${className}`}
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M3.2261 2L0.11499 14H2.18111L2.95889 11H6.04092L6.81869 14H8.88482L5.77371 2H3.2261ZM5.5224 9L4.4999 5.05609L3.47741 9H5.5224Z"
        fill="#000000"
      />
      <path
        className={`${className}`}
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M14 7.33682C13.5454 7.12085 13.0368 7 12.5 7C10.567 7 9.00004 8.567 9.00004 10.5C9.00004 12.433 10.567 14 12.5 14C13.0368 14 13.5454 13.8792 14 13.6632V14H16V7H14V7.33682ZM11 10.5C11 9.67157 11.6716 9 12.5 9C13.3285 9 14 9.67157 14 10.5C14 11.3284 13.3285 12 12.5 12C11.6716 12 11 11.3284 11 10.5Z"
        fill="#000000"
      />
    </svg>
  );
};

export default TitleIcon;
