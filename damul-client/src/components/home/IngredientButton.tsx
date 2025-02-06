import { CATEGORY } from "@/constants/category";
import DamulButton from "../common/DamulButton";

interface IngredientButtonProps {
  variant: keyof typeof CATEGORY;
  name: string;
}

const IngredientButton = ({ variant, name }: IngredientButtonProps) => {
  const IconComponent = CATEGORY[variant];
  return (
    <DamulButton className="bg-white h-full text-black flex items-center justify-center py-2 shadow-md border-1 border-normal-100 rounded-xl hover:bg-normal-100 focus:outline-none">
      <IconComponent className="scale-150" />
      <div className="flex flex-col w-full justify-center items-center">
        <div className="w-12 overflow-hidden text-xs font-bold text-ellipsis whitespace-nowrap">
          {name}
        </div>
        <div className="text-xs">92%</div>
      </div>
    </DamulButton>
  );
};

export default IngredientButton;
