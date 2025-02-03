import { SVGProps } from "@/types/svg";

const PlusIcon = ({ className }: SVGProps) => {
  return (
    <svg
      className={className}
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 21.5C4.45 21.5 3.97917 21.3042 3.5875 20.9125C3.19583 20.5208 3 20.05 3 19.5V5.5C3 4.95 3.19583 4.47917 3.5875 4.0875C3.97917 3.69583 4.45 3.5 5 3.5H19C19.55 3.5 20.0208 3.69583 20.4125 4.0875C20.8042 4.47917 21 4.95 21 5.5V19.5C21 20.05 20.8042 20.5208 20.4125 20.9125C20.0208 21.3042 19.55 21.5 19 21.5H5ZM5 19.5H19V5.5H5V19.5Z"
        fill="#1D1B20"
      />
      <path
        d="M12.0002 7.69995L12.0002 17.3M16.8002 12.5L7.2002 12.5"
        stroke="black"
        stroke-width="2"
        stroke-linecap="round"
      />
    </svg>
  );
};

export default PlusIcon;
