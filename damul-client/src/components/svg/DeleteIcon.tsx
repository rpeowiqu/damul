import { SVGProps } from "@/types/svg";

const DeleteIcon = ({ className }: SVGProps) => {
  return (
    <svg
      className={className}
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Trash 02">
        <path
          id="Icon"
          d="M3.02051 4.23891H11.9805M6.38051 10.1683V6.61067M8.62051 10.1683V6.61067M9.74051 12.5401H5.26051C4.64195 12.5401 4.14051 12.0091 4.14051 11.3542V4.83185C4.14051 4.50438 4.39123 4.23891 4.70051 4.23891H10.3005C10.6098 4.23891 10.8605 4.50438 10.8605 4.83185V11.3542C10.8605 12.0091 10.3591 12.5401 9.74051 12.5401ZM6.38051 4.23891H8.62051C8.92979 4.23891 9.18051 3.97344 9.18051 3.64597V3.05302C9.18051 2.72555 8.92979 2.46008 8.62051 2.46008H6.38051C6.07123 2.46008 5.82051 2.72555 5.82051 3.05302V3.64597C5.82051 3.97344 6.07123 4.23891 6.38051 4.23891Z"
          stroke="white"
          stroke-width="1.12"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
    </svg>
  );
};

export default DeleteIcon;
