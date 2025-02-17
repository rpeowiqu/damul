import { SVGProps } from "@/types/svg";

const BarCodeIcon = ({ className }: SVGProps) => {
  return (
    <svg
      className={className}
      width="668"
      height="534"
      viewBox="0 0 668 534"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M67.3334 0.333374V533.667H0.666748V0.333374H67.3334ZM200.667 0.333374V533.667H134V0.333374H200.667ZM334 0.333374V533.667H267.333V0.333374H334ZM667.333 0.333374V533.667H600.667V0.333374H667.333ZM434 0.333374V533.667H400.667V0.333374H434ZM534 0.333374V533.667H500.667V0.333374H534Z"
        fill="black"
      />
    </svg>
  );
};

export default BarCodeIcon;
