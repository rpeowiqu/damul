import {
  ChangeEvent,
  KeyboardEvent,
  MouseEventHandler,
  Dispatch,
  SetStateAction,
} from "react";
import { Input } from "@/components/ui/input";
import SearchIcon from "../svg/SearchIcon";

interface SearchBoxProps {
  placeholder?: string;
  onInputClick?: MouseEventHandler<HTMLInputElement>; // Input 클릭 이벤트
  onButtonClick?: (_value: string) => void; // 버튼 클릭 이벤트 (입력값 전달)
  inputValue?: string;
  setInputValue?: Dispatch<SetStateAction<string>>; // 상태 업데이트 함수
  className?: string; // 추가된 스타일링 prop
}

const DamulSearchBox = ({
  placeholder,
  onInputClick,
  onButtonClick,
  inputValue,
  setInputValue,
  className = "",
}: SearchBoxProps) => {
  // 입력값 변경 핸들러
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue?.(e.target.value);
  };

  // 엔터 키 입력 핸들러
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && (inputValue || "").trim() !== "") {
      e.preventDefault();
      onButtonClick?.(inputValue || ""); // 기본값 "" 설정
      setInputValue?.("");
    }
  };

  // 검색 버튼 클릭 핸들러
  const handleButtonClick = () => {
    if ((inputValue || "").trim() !== "") {
      onButtonClick?.(inputValue || ""); // 기본값 "" 설정
      setInputValue?.("");
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Input
        placeholder={placeholder}
        className={`${className} rounded-lg transition-colors p-2 pr-8 pc:pl-4 pc:pr-10 bg-normal-50 border border-normal-100 text-sm text-normal-700 focus:border-normal-500`}
        onClick={onInputClick}
        onChange={handleInputChange}
        value={inputValue}
        onKeyDown={handleKeyDown}
      />
      <button
        type="button"
        className="absolute inset-y-2 right-2 pc:right-3"
        onClick={handleButtonClick}
      >
        <SearchIcon className="fill-normal-300" />
      </button>
    </div>
  );
};

export default DamulSearchBox;
