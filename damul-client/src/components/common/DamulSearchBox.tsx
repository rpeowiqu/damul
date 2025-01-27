import { useState, ChangeEvent, MouseEventHandler } from "react";
import { Input } from "@/components/ui/input";
import SearchIcon from "../svg/SearchIcon";

interface SearchBoxProps {
  placeholder?: string;
  onInputClick?: MouseEventHandler<HTMLInputElement>; // Input 클릭 이벤트
  onButtonClick?: (value: string) => void; // 버튼 클릭 이벤트 (입력값 전달)
}

const DamulSearchBox = ({
  placeholder,
  onInputClick,
  onButtonClick,
}: SearchBoxProps) => {
  const [inputValue, setInputValue] = useState<string>("");

  // 입력값 변경 핸들러
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="relative">
      <Input
        placeholder={placeholder}
        className={"rounded-lg transition-colors p-2 pr-8 pc:pl-4 pc:pr-10 bg-normal-50 border-1 border-normal-100 text-sm text-normal-700 focus:border-normal-500"}
        onClick={onInputClick}
        onChange={handleInputChange}
        value={inputValue}
      />
      <button
        type="button"
        className="absolute inset-y-2 right-2 pc:right-3"
        onClick={() => onButtonClick?.(inputValue)}
      >
        <SearchIcon className="fill-normal-300" />
      </button>
    </div>
  );
};

export default DamulSearchBox;
