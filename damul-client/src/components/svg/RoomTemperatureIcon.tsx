import { SVGProps } from "@/types/svg";

const RoomTemparatureIcon = ({ className }: SVGProps) => {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="thermometer_add_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24 1">
        <path
          id="Vector"
          d="M17 11V8H14V6H17V3H19V6H22V8H19V11H17ZM8 21C6.61667 21 5.4375 20.5125 4.4625 19.5375C3.4875 18.5625 3 17.3833 3 16C3 15.2 3.175 14.4542 3.525 13.7625C3.875 13.0708 4.36667 12.4833 5 12V6C5 5.16667 5.29167 4.45833 5.875 3.875C6.45833 3.29167 7.16667 3 8 3C8.83333 3 9.54167 3.29167 10.125 3.875C10.7083 4.45833 11 5.16667 11 6V12C11.6333 12.4833 12.125 13.0708 12.475 13.7625C12.825 14.4542 13 15.2 13 16C13 17.3833 12.5125 18.5625 11.5375 19.5375C10.5625 20.5125 9.38333 21 8 21ZM7 10H9V6C9 5.71667 8.90417 5.47917 8.7125 5.2875C8.52083 5.09583 8.28333 5 8 5C7.71667 5 7.47917 5.09583 7.2875 5.2875C7.09583 5.47917 7 5.71667 7 6V10Z"
          fill="#FF3535"
        />
      </g>
    </svg>
  );
};

export default RoomTemparatureIcon;
