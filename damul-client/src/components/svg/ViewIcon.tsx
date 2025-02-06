import { SVGProps } from "@/types/svg";

const ViewIcon = ({ className }: SVGProps) => {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_412_13096)">
        <path
          className={className}
          d="M0.982422 7.12001C0.982422 7.12001 3.22242 2.64001 7.14242 2.64001C11.0624 2.64001 13.3024 7.12001 13.3024 7.12001C13.3024 7.12001 11.0624 11.6 7.14242 11.6C3.22242 11.6 0.982422 7.12001 0.982422 7.12001Z"
          stroke="#1E1E1E"
          stroke-width="1.12"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          className={className}
          d="M7.14242 8.80001C8.07026 8.80001 8.82242 8.04785 8.82242 7.12001C8.82242 6.19218 8.07026 5.44001 7.14242 5.44001C6.21458 5.44001 5.46242 6.19218 5.46242 7.12001C5.46242 8.04785 6.21458 8.80001 7.14242 8.80001Z"
          stroke="#1E1E1E"
          stroke-width="1.12"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_412_13096">
          <rect
            width="13.44"
            height="13.44"
            fill="white"
            transform="translate(0.421875 0.400024)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default ViewIcon;
