import { TabSVGProps } from "@/types/svg";

const CommunityIcon = ({
  iconFill: iconFill,
  iconStroke: iconStroke,
}: TabSVGProps) => {
  return (
    <svg
      className="pc:w-6 pc:h-6"
      width="20"
      height="20"
      viewBox="0 0 27 27"
      fill={iconFill}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.63323 1.8999H4.47768C3.05401 1.8999 1.8999 3.05401 1.8999 4.47768V17.3666V22.5221C1.8999 23.9458 3.05401 25.0999 4.47768 25.0999H17.3666H22.5221C23.9458 25.0999 25.0999 23.9458 25.0999 22.5221V9.63323V4.47768C25.0999 3.05401 23.9458 1.8999 22.5221 1.8999H9.8749M8.4249 10.0746V8.66081M18.5749 10.0746V8.66081M9.4552 17.8501C11.1084 19.131 14.8156 19.131 17.1257 17.8501M12.7749 14.3158L13.0752 14.023C13.3471 13.7579 13.4999 13.3983 13.4999 13.0233V9.36768"
        stroke={iconStroke}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default CommunityIcon;
