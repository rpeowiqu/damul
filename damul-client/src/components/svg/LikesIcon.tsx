import { SVGProps } from "@/types/svg";

const LikesIcon = ({ className }: SVGProps) => {
  return (
    <svg
      className={`${className}`}
      width="15"
      height="14"
      viewBox="0 0 15 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className={`${className}`}
        d="M8.80063 6.00008H11.4685C11.6594 6.00008 11.8471 6.04888 12.0138 6.14183C12.1805 6.23478 12.3207 6.36879 12.4211 6.53116C12.5215 6.69353 12.5787 6.87885 12.5873 7.06955C12.5959 7.26024 12.5556 7.44996 12.4703 7.62072L10.5103 11.5407C10.4173 11.7269 10.2742 11.8835 10.0971 11.9929C9.92008 12.1023 9.71604 12.1602 9.5079 12.1601H7.25839C7.16711 12.1601 7.07582 12.1489 6.98678 12.1265L4.88063 11.6001M8.80063 6.00008V3.20008C8.80063 2.90304 8.68263 2.61816 8.47258 2.40812C8.26254 2.19808 7.97767 2.08008 7.68063 2.08008H7.62742C7.34742 2.08008 7.12063 2.30688 7.12063 2.58688C7.12063 2.98672 7.00247 3.3776 6.78015 3.71024L4.88063 6.56008V11.6001M8.80063 6.00008H7.68063M4.88063 11.6001H3.76063C3.46358 11.6001 3.17871 11.4821 2.96867 11.272C2.75862 11.062 2.64063 10.7771 2.64062 10.4801V7.12008C2.64062 6.82304 2.75862 6.53816 2.96867 6.32812C3.17871 6.11808 3.46358 6.00008 3.76063 6.00008H5.16063"
        stroke="black"
        stroke-width="1.12"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default LikesIcon;
