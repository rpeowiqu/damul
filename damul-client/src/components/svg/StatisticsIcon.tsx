import { TabSVGProps } from "@/types/svg";

const StatisticsIcon = ({
  iconFill: iconFill,
  iconStroke: iconStroke,
}: TabSVGProps) => {
  return (
    <svg
      className="pc:w-6 pc:h-6"
      width="20"
      height="20"
      stroke={iconStroke}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.4341 22.6028V2.39746C15.4341 1.84518 14.9864 1.39746 14.4341 1.39746H9.36616C8.81388 1.39746 8.36616 1.84518 8.36616 2.39746V22.6028M15.4341 22.6028L15.4322 10.3963C15.4321 9.84394 15.8799 9.39613 16.4322 9.39613H21.5C22.0523 9.39613 22.5 9.84384 22.5 10.3961V21.6028C22.5 22.1551 22.0523 22.6028 21.5 22.6028H15.4341ZM15.4341 22.6028H8.36616M8.36616 22.6028V16.6028C8.36616 16.0505 7.91845 15.6028 7.36616 15.6028H2.5C1.94772 15.6028 1.5 16.0505 1.5 16.6028V21.6028C1.5 22.1551 1.94771 22.6028 2.5 22.6028H8.36616Z"
        fill={iconFill}
        stroke={iconStroke}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default StatisticsIcon;
