import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { CATEGORYNAME } from "@/constants/category";

const IngredientCategoryFilter = () => {
  return (
    <Select>
      <SelectTrigger className="w-24 text-xs bg-normal-50 text-normal-500">
        <SelectValue placeholder="정렬" />
      </SelectTrigger>
      <SelectContent className="max-h-[200px]">
        <SelectGroup>
          <SelectLabel>식자재 분류</SelectLabel>
          <SelectItem
            key="all"
            className="data-[highlighted]:bg-positive-50 data-[state=checked]:text-positive-500"
            value="all"
          >
            전체
          </SelectItem>
          {Object.entries(CATEGORYNAME).map(([key, label]) => (
            <SelectItem
              key={key}
              className="data-[highlighted]:bg-positive-50 data-[state=checked]:text-positive-500"
              value={key}
            >
              {label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default IngredientCategoryFilter;
