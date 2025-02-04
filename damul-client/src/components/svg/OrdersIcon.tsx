import { SVGProps } from "@/types/svg";

const OrdersIcon = ({ className }: SVGProps) => {
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
        d="M4.9209 7C4.9209 5.89543 5.81633 5 6.9209 5H18.9209C20.0255 5 20.9209 5.89543 20.9209 7V19C20.9209 20.1046 20.0255 21 18.9209 21H6.9209C5.81633 21 4.9209 20.1046 4.9209 19V7Z"
        fill="black"
        fill-opacity="0.15"
      />
      <path
        className={`${className}`}
        d="M20.9209 11V19C20.9209 20.1046 20.0255 21 18.9209 21H6.9209C5.81633 21 4.9209 20.1046 4.9209 19V11M20.9209 11V7C20.9209 5.89543 20.0255 5 18.9209 5H15.9209M20.9209 11H4.9209M15.9209 3V5M15.9209 7V5M9.9209 3V5M9.9209 7V5M4.9209 11V7C4.9209 5.89543 5.81633 5 6.9209 5H9.9209M15.9209 5H9.9209"
        stroke="black"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default OrdersIcon;
