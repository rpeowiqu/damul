import { SVGProps } from "@/types/svg";

const AlertTriangleIcon = ({ className }: SVGProps) => {
  return (
    <svg
      className={className}
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Alert Triangle">
        <path
          id="Icon"
          d="M8.5 9.1375V5.96023M8.5 11.4925V11.5205M12.5162 14.1666H4.4838C3.38661 14.1666 2.4607 13.4415 2.16938 12.4494C2.04502 12.0259 2.19782 11.5848 2.43154 11.2093L6.44774 3.96737C7.38869 2.45529 9.61131 2.45529 10.5523 3.96737L14.5685 11.2093C14.8022 11.5848 14.955 12.0259 14.8306 12.4494C14.5393 13.4415 13.6134 14.1666 12.5162 14.1666Z"
          stroke="#FF3535"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export default AlertTriangleIcon;
