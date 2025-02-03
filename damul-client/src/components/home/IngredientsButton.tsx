import { CATEGORY } from "@/constants/category";

interface IngredientsButtonProps {
  variant: keyof typeof CATEGORY;
  name: string;
}

const IngredientsButton = ({ variant, name }: IngredientsButtonProps) => {
  const IconComponent = CATEGORY[variant];
  return (
    <button className="flex items-center justify-center py-2 shadow-md border-1 border-normal-100 rounded-xl hover:bg-normal-100 focus:outline-none">
      <IconComponent />
      <div>
        <div className="w-12 overflow-hidden text-xs font-bold text-ellipsis whitespace-nowrap">
          {name}
        </div>
        <div className="text-xs">92%</div>
      </div>
    </button>
  );
};

export default IngredientsButton;
