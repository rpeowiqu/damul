import { SVGProps } from "@/types/svg";

const DeleteIcon = ({ className }: SVGProps) => {
  return (
    <svg
      className={`${className}`}
      width="11"
      height="12"
      viewBox="0 0 11 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className={`${className}`}
        d="M2.33008 12C1.96341 12 1.64952 11.8694 1.38841 11.6083C1.1273 11.3472 0.996745 11.0333 0.996745 10.6667V2H0.330078V0.666667H3.66341V0H7.66341V0.666667H10.9967V2H10.3301V10.6667C10.3301 11.0333 10.1995 11.3472 9.93841 11.6083C9.6773 11.8694 9.36341 12 8.99674 12H2.33008ZM8.99674 2H2.33008V10.6667H8.99674V2ZM3.66341 9.33333H4.99674V3.33333H3.66341V9.33333ZM6.33008 9.33333H7.66341V3.33333H6.33008V9.33333Z"
        fill="#A6A6A6"
      />
    </svg>
  );
};

export default DeleteIcon;
