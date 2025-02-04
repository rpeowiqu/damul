import { TabSVGProps } from "@/types/svg";

const ChattingIcon = ({
  iconFill: iconFill,
  iconStroke: iconStroke,
}: TabSVGProps) => {
  return (
    <svg
      className="pc:w-7 pc:h-6"
      width="22"
      height="20"
      viewBox="0 0 27 23"
      fill={iconFill}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.6999 6.5H17.8499M7.6999 11.5H13.4999M13.1216 16.2826L7.06947 21.5V16.2826H4.7999C3.19828 16.2826 1.8999 15.1633 1.8999 13.7826V4C1.8999 2.61929 3.19828 1.5 4.7999 1.5H22.1999C23.8015 1.5 25.0999 2.61929 25.0999 4V13.7826C25.0999 15.1633 23.8015 16.2826 22.1999 16.2826H13.1216Z"
        stroke={iconStroke}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default ChattingIcon;
