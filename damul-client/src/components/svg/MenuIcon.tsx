import { SVGProps } from "@/types/svg";

const MenuIcon = ({ className }: SVGProps) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
    >
      <path
        d="M20.5 18H4.5M20.5 12H4.5M20.5 6H4.5"
        stroke="#939393"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default MenuIcon;
