import { SVGProps } from "@/types/svg";

const ContentIcon = ({ className }: SVGProps) => {
  return (
    <svg
      className={`${className}`}
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className={`${className}`}
        d="M4.9209 5C4.9209 4.44772 5.36861 4 5.9209 4H19.9209C20.4732 4 20.9209 4.44772 20.9209 5V19C20.9209 19.5523 20.4732 20 19.9209 20H5.9209C5.36861 20 4.9209 19.5523 4.9209 19V5Z"
        fill="black"
        fill-opacity="0.15"
      />
      <path
        className={`${className}`}
        d="M7.9209 8H17.9209M7.9209 12H17.9209M11.9209 16H17.9209M4.9209 4H20.9209V20H4.9209V4Z"
        stroke="black"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default ContentIcon;
