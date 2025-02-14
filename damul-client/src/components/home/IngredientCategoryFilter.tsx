import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { CATEGORY_INFO } from "@/constants/category";

interface IngredientCategoryFilterProps {
  onValueChange: (value: string) => void;
}

const IngredientCategoryFilter = ({
  onValueChange,
}: IngredientCategoryFilterProps) => {
  return (
    <Select onValueChange={onValueChange}>
      <SelectTrigger className="w-24 text-xs bg-normal-50 text-normal-500">
        <SelectValue placeholder="정렬" />
      </SelectTrigger>
      <SelectContent className="max-h-[200px]">
        <SelectGroup>
          <SelectLabel>식자재 분류</SelectLabel>
          <SelectItem
            key="all"
            className="data-[highlighted]:bg-positive-50 data-[state=checked]:text-positive-500"
            value="0"
          >
            전체
          </SelectItem>
          {Object.values(CATEGORY_INFO).map((category) => (
            <SelectItem
              key={`${category} ${Math.random()}`}
              className="data-[highlighted]:bg-positive-50 data-[state=checked]:text-positive-500"
              value={`${category.number}`}
            >
              {category.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default IngredientCategoryFilter;
