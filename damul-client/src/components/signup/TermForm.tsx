import { FormEvent, useState, useEffect } from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import DamulButton from "../common/DamulButton";
import DamulModal from "../common/DamulModal";
import termList from "@/constants/terms";
import { SignUpFormProps } from "@/pages/signUp/SignUpPage";

const checkList = [
  {
    id: "checkAge",
    label: "(필수) 만 14세 이상입니다.",
  },
  {
    id: "checkService",
    label: "(필수) 서비스 이용약관에 동의",
  },
  {
    id: "checkPrivacy",
    label: "(필수) 개인정보 수집이용에 동의",
  },
  {
    id: "checkPromotion",
    label: "(선택) 홍보 및 마케팅 이용에 동의",
  },
  {
    id: "checkMarketing",
    label: "(선택) 마케팅 개인정보 제3자 제공 동의",
  },
];

const TermsForm = ({ userInput, setUserInput, onNext }: SignUpFormProps) => {
  const [infoText, setInfoText] = useState<string>("");

  // 모달 관련
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [termContent, setTermContent] = useState<string>("");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 필수 항목(1, 2, 3번)이 모두 체크되었는지 확인
    const targetBit = (1 << 3) - 1;

    if ((userInput.selectBit & targetBit) !== targetBit) {
      setInfoText("필수 항목을 모두 체크해 주세요.");
      return;
    }

    onNext?.();
  };

  const handleAllCheckChange = (checked: boolean) => {
    if (checked) {
      setUserInput({ ...userInput, selectBit: (1 << checkList.length) - 1 });
    } else {
      setUserInput({ ...userInput, selectBit: 0 });
    }
  };

  const handleCheckChange = (index: number) => {
    if (userInput.selectBit & (1 << index)) {
      setUserInput({
        ...userInput,
        selectBit: userInput.selectBit & ~(1 << index),
      });
    } else {
      setUserInput({
        ...userInput,
        selectBit: userInput.selectBit | (1 << index),
      });
    }
  };

  useEffect(() => {
    setIsOpen(termContent ? true : false);
  }, [termContent]);

  return (
    <div className="px-10">
      <h1 className="text-xl font-black text-normal-700 mt-36">
        서비스 이용약관에 동의해 주세요.
      </h1>

      <form onSubmit={onSubmit} className="flex flex-col gap-20 mt-16">
        <div>
          <div className="flex items-center space-x-3">
            <Checkbox
              id="checkAll"
              className="rounded-full"
              checked={userInput.selectBit === (1 << checkList.length) - 1}
              onCheckedChange={handleAllCheckChange}
            />
            <Label
              htmlFor="checkAll"
              className="text-normal-700 text-lg font-bold"
            >
              네, 모두 동의합니다.
            </Label>
          </div>

          <hr className="my-5" />

          <div className="flex flex-col gap-3">
            {checkList.map((item, index) => {
              return (
                <div className="flex items-center space-x-3" key={item.id}>
                  <Checkbox
                    id={item.id}
                    className="rounded-full"
                    checked={(userInput.selectBit & (1 << index)) !== 0}
                    onCheckedChange={() => handleCheckChange(index)}
                  />
                  <div className="flex justify-between w-full">
                    <Label
                      htmlFor={item.id}
                      className="text-normal-700 text-base"
                    >
                      {item.label}
                    </Label>
                    <p
                      className="text-normal-300 cursor-pointer"
                      onClick={() => setTermContent(termList[index])}
                    >
                      보기
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-negative-400 text-sm min-h-5 mt-5">{infoText}</p>
        </div>

        <DamulButton
          variant="positive"
          size="full"
          textSize="base"
          onClick={() => {}}
        >
          다음
        </DamulButton>
      </form>

      <p className="text-normal-300 text-sm mt-6">
        ‘선택’ 항목에 동의하지 않아도 서비스 이용이 가능합니다. 개인정보 수집 및
        이용에 대한 동의를 거부할 권리가 있으며, 동의 거부 시 회원제 서비스
        이용이 제한됩니다.
      </p>

      <DamulModal
        isOpen={isOpen}
        setIsOpen={() => {
          if (isOpen) {
            setTermContent("");
          }
        }}
        triggerComponent={<div></div>}
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
