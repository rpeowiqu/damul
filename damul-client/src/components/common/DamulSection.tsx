import { ReactNode } from "react";

interface DamulSectionProps {
  title?: string | ReactNode;
  description?: string | ReactNode;
  className?: string;
  children?: ReactNode;
}

const DamulSection = ({
  title,
  description,
  className,
  children,
}: DamulSectionProps) => {
  return (
    <div className={`flex flex-col gap-3 p-4 bg-white ${className}`}>
      {(title || description) && (
        <div className="flex flex-col">
          <div className="text-base sm:text-lg font-black text-normal-700">
            {title}
          </div>
          <div className="text-sm sm:text-base text-normal-500 ">
            {description}
          </div>
        </div>
      )}

      {children}
    </div>
  );
};

export default DamulSection;
