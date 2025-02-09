import {
  FormEvent,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import DamulButton from "../common/DamulButton";
import DamulModal from "../common/DamulModal";
import useCloseOnBack from "@/hooks/useCloseOnBack";
import { Term } from "@/pages/signup/SignUpPage";

export interface TermsFormProps {
  selectBit: number;
  setSelectBit: Dispatch<SetStateAction<number>>;
  terms: Term[];
  onNext: () => void;
}

const TermsForm = ({
  selectBit,
  setSelectBit,
  terms,
  onNext,
}: TermsFormProps) => {
  const [infoText, setInfoText] = useState<string>("");
  const [isOpen, setIsOpen] = useCloseOnBack();
  const [termContent, setTermContent] = useState<string>("");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (checkRequired()) {
      onNext();
    }
  };

  const handleAllCheckChange = (checked: boolean) => {
    if (checked) {
      setSelectBit((1 << terms.length) - 1);
    } else {
      setSelectBit(0);
    }
  };

  const handleCheckChange = (index: number) => {
    if (selectBit & (1 << index)) {
      setSelectBit(selectBit & ~(1 << index));
    } else {
      setSelectBit(selectBit | (1 << index));
    }
  };

  const checkRequired = () => {
    // 필수 항목(1, 2, 3번)이 모두 체크되었는지 확인
    const requiredBit = (1 << 3) - 1;
    if ((selectBit & requiredBit) === requiredBit) {
      setInfoText("");
      return true;
    } else {
      setInfoText("필수 항목을 모두 체크해 주세요.");
      return false;
    }
  };

  useEffect(() => {
    setIsOpen(termContent ? true : false);
  }, [termContent]);

  useEffect(() => {
    checkRequired();
  }, [selectBit]);

  return (
    <div className="pt-10">
      <h1 className="text-lg sm:text-xl font-black text-normal-700">
        서비스 이용약관에 동의해 주세요.
      </h1>

      <form onSubmit={onSubmit} className="flex flex-col gap-20 mt-16">
        <div>
          <div className="flex items-center space-x-3">
            <Checkbox
              id="checkAll"
              className="rounded-full"
              checked={selectBit === (1 << terms.length) - 1}
              onCheckedChange={handleAllCheckChange}
            />
            <Label
              htmlFor="checkAll"
              className="text-normal-700 text-base sm:text-lg font-bold"
            >
              네, 모두 동의합니다.
            </Label>
          </div>

          <hr className="my-5" />

          <div className="flex flex-col gap-3">
            {terms.map((item, index) => {
              return (
                <div className="flex items-center space-x-3" key={item.id}>
                  <Checkbox
                    id={String(item.id)}
                    className="rounded-full"
                    checked={(selectBit & (1 << index)) !== 0}
                    onCheckedChange={() => handleCheckChange(index)}
                  />
                  <div className="flex justify-between w-full">
                    <Label
                      htmlFor={String(item.id)}
                      className="text-normal-700 text-sm sm:text-base"
                    >
                      {item.title}
                    </Label>
                    <p
                      className="text-sm sm:text-base text-normal-300 cursor-pointer"
                      onClick={() => setTermContent(terms[index].content)}
                    >
                      보기
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="min-h-6 mt-5 text-sm text-negative-400">{infoText}</p>
        </div>

        <DamulButton type="submit" variant="positive" className="w-full">
          다음
        </DamulButton>
      </form>

      <p className="text-normal-300 text-xs sm:text-sm mt-6">
        ‘선택’ 항목에 동의하지 않아도 서비스 이용이 가능합니다. 개인정보 수집 및
        이용에 대한 동의를 거부할 권리가 있으며, 동의 거부 시 회원제 서비스
        이용이 제한됩니다.
      </p>

      <DamulModal
        isOpen={isOpen}
        onOpenChange={() => {
          if (isOpen) {
            setTermContent("");
          }
        }}
        contentStyle="max-w-96"
        title="이용약관"
      >
        <div className="w-full h-52 px-5 overflow-y-auto whitespace-pre-wrap">
          {termContent}
        </div>
      </DamulModal>
    </div>
  );
};

export default TermsForm;
