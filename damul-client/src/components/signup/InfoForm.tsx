import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useState,
} from "react";
import { Input } from "../ui/input";
import { Label } from "@radix-ui/react-label";
import { Textarea } from "../ui/textarea";
import { isValidNickname } from "@/utils/regex";
import DamulButton from "../common/DamulButton";
import { signUp } from "@/service/auth";
import { checkNicknameDuplication } from "@/service/user";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { UserInput } from "@/pages/signup/SignUpPage";

interface InfoFormProps {
  email: string;
  userInput: UserInput;
  setUserInput: Dispatch<SetStateAction<UserInput>>;
  onPrev: () => void;
}

const InfoForm = ({
  email,
  userInput,
  setUserInput,
  onPrev,
}: InfoFormProps) => {
  const [status, setStatus] = useState<
    "none" | "available" | "duplicate" | "validLength"
  >("none");
  const nav = useNavigate();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newStatus = await checkNickname();
    if (newStatus === "available") {
      const response = await signUp(userInput);
      if (response?.status === 200) {
        alert("회원가입 되었습니다.");
        nav("/home", { replace: true });
      }
    }
    setStatus(newStatus);
  };

  const handleInput = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    switch (name) {
      case "nickname":
        if (!isValidNickname(value)) {
          setStatus("validLength");
        } else {
          setStatus("none");
        }
        setUserInput({ ...userInput, nickname: value });
        break;
      case "selfIntroduction":
        if (value.length <= 255) {
          setUserInput({ ...userInput, selfIntroduction: value });
        }
        break;
    }
  };

  const checkNickname = async () => {
    if (!isValidNickname(userInput.nickname)) {
      return "validLength";
    } else {
      const response = await checkNicknameDuplication(userInput.nickname);
      if (!response?.data) {
        return "available";
      } else {
        return "duplicate";
      }
    }
  };

  const getInfoText = () => {
    switch (status) {
      case "available":
        return "사용 가능한 닉네임입니다!";
      case "duplicate":
        return "이미 사용중인 닉네임입니다.";
      case "validLength":
        return "닉네임은 한글, 영문 2-8자로만 구성되어야 합니다.";
    }

    return "";
  };

  return (
    <div className="px-6 sm:px-10">
      <div className="flex gap-5 mt-10">
        <button className="font-black" onClick={() => onPrev()}>
          &lt;
        </button>
        <h1 className="text-lg sm:text-xl font-black text-normal-700">
          회원 정보를 입력해 주세요.
        </h1>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-10 mt-10">
        <div>
          <p className="text-sm text-positive-400 font-bold">
            연동된 이메일 계정
          </p>
          <p>{email}</p>
        </div>

        <div className="relative">
          <div className="flex w-full items-end space-x-3">
            <div className="flex flex-col justify-end w-full">
              <Label
                htmlFor="nickname"
                className="text-sm text-positive-400 font-bold"
              >
                닉네임
              </Label>
              <Input
                id="nickname"
                name="nickname"
                type="text"
                placeholder="닉네임을 입력해 주세요."
                value={userInput.nickname}
                onChange={handleInput}
                className={clsx(
                  "focus-visible:ring-1 focus-visible:ring-positive-400 focus-visible:ring-offset-0 text-sm",
                  {
                    "focus-visible:ring-negative-400":
                      status === "duplicate" || status === "validLength",
                  },
                )}
              />
            </div>

            <DamulButton
              variant="positive"
              className="text-sm"
              onClick={async () => {
                const newStatus = await checkNickname();
                setStatus(newStatus);
              }}
            >
              중복 확인
            </DamulButton>
          </div>

          <p
            className={clsx("min-h-6 text-sm text-negative-400", {
              "text-positive-400": status === "available",
            })}
          >
            {getInfoText()}
          </p>
        </div>

        <div className="flex flex-col justify-end w-full">
          <Label
            htmlFor="selfIntroduction"
            className="text-sm text-positive-400 font-bold"
          >
            자기소개
          </Label>
          <Textarea
            id="selfIntroduction"
            name="selfIntroduction"
            className="resize-none focus-visible:ring-1 focus-visible:ring-positive-400 focus-visible:ring-offset-0 text-sm"
            placeholder="회원님에 대해 자유롭게 소개해 보세요."
            value={userInput.selfIntroduction}
            onChange={handleInput}
          />
          <p className="text-end text-xs">
            {userInput.selfIntroduction.length} / 255
          </p>
        </div>

        <DamulButton type="submit" variant="positive" className="w-full">
          가입하기
        </DamulButton>
      </form>
    </div>
  );
};

export default InfoForm;
