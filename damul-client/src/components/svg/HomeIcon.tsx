import { TabSVGProps } from "@/types/svg";

const HomeIcon = ({ iconStroke: iconStroke }: TabSVGProps) => {
  return (
    <svg
      className="pc:w-5 pc:h-6"
      width="20"
      height="20"
      viewBox="0 0 18 23"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.5 6.9V3.45H6.75V6.9H4.5ZM4.5 17.25V11.5H6.75V17.25H4.5ZM2.25 23C1.63125 23 1.10156 22.7748 0.660937 22.3244C0.220312 21.874 0 21.3325 0 20.7V2.3C0 1.6675 0.220312 1.12604 0.660937 0.675625C1.10156 0.225208 1.63125 0 2.25 0H15.75C16.3687 0 16.8984 0.225208 17.3391 0.675625C17.7797 1.12604 18 1.6675 18 2.3V20.7C18 21.3325 17.7797 21.874 17.3391 22.3244C16.8984 22.7748 16.3687 23 15.75 23H2.25ZM2.25 20.7H15.75V10.35H2.25V20.7ZM2.25 8.05H15.75V2.3H2.25V8.05Z"
        fill={iconStroke}
      />
    </svg>
  );
};

export default HomeIcon;
