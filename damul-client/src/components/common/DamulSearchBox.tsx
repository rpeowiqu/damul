import {
  ChangeEvent,
  KeyboardEvent,
  MouseEventHandler,
  Dispatch,
  SetStateAction,
  FocusEventHandler,
  // useEffect,
  // useRef,
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
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  resetAfter?: boolean;
}

const DamulSearchBox = ({
  placeholder,
  onInputClick,
  onButtonClick,
  inputValue,
  setInputValue,
  className,
  onFocus,
  onBlur,
  resetAfter = true,
}: SearchBoxProps) => {
  // const inputRef = useRef<HTMLInputElement>(null);

  // useEffect(() => {
  //   if (!onInputClick) {
  //     inputRef.current?.focus();
  //   }
  // }, []);

  // 입력값 변경 핸들러
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue?.(e.target.value);
  };

  // 엔터 키 입력 핸들러
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onButtonClick?.(inputValue || "");

      if (resetAfter) {
        setInputValue?.("");
      }
    }
  };

  // 검색 버튼 클릭 핸들러
  const handleButtonClick = () => {
    onButtonClick?.(inputValue || "");

    if (resetAfter) {
      setInputValue?.("");
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Input
        // ref={inputRef}
        placeholder={placeholder}
        className={`rounded-lg transition-colors p-2 pr-8 pc:pl-4 pc:pr-10 bg-normal-50 border border-normal-100 text-sm text-normal-700 focus:border-normal-500 ${className}`}
        onClick={onInputClick}
        onChange={handleInputChange}
        value={inputValue}
        onKeyDown={handleKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
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
