import { SVGProps } from "@/types/svg";

const IngredientsIcon = ({ className }: SVGProps) => {
  return (
    <svg
      className={`${className}`}
      fill="#000000"
      width="800px"
      height="800px"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className={`${className}`}
        d="M14,11a1,1,0,1,1,1,1A1,1,0,0,1,14,11ZM9,18a1,1,0,1,0-1-1A1,1,0,0,0,9,18ZM3,14A8.992,8.992,0,0,1,9,5.522V3H8A1,1,0,0,1,8,1h8a1,1,0,0,1,0,2H15V5.522A9,9,0,1,1,3,14Zm2.134-1.312c5.988-2.015,7.655.875,13.757,2.5A6.943,6.943,0,0,0,13.75,7.23,1,1,0,0,1,13,6.262V3H11V6.262a1,1,0,0,1-.75.968A6.989,6.989,0,0,0,5.134,12.688ZM5.057,14.84a6.989,6.989,0,0,0,13.206,2.267C11.887,15.384,10.72,12.6,5.057,14.84Z"
      />
    </svg>
  );
};

export default IngredientsIcon;
