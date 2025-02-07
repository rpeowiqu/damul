import { ChangeEvent, FormEvent, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "@radix-ui/react-label";
import { Textarea } from "../ui/textarea";
import { isValidNickname } from "@/utils/regex";
import { SignUpFormProps } from "@/pages/signup/SignUpPage";
import DamulButton from "../common/DamulButton";

const InfoForm = ({ userInput, setUserInput, onPrev }: SignUpFormProps) => {
  const [infoText, setInfoText] = useState<string>("");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isValidNickname(userInput.nickname)) {
      setInfoText("닉네임은 한글, 영문 2-8자로만 구성되어야 합니다.");
    } else {
      setInfoText("");
      alert("회원가입 되었습니다.");
    }
  };

  const handleInput = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    switch (name) {
      case "nickname":
        if (!isValidNickname(value)) {
          setInfoText("닉네임은 한글, 영문 2-8자로만 구성되어야 합니다.");
        } else {
          setInfoText("");
        }
        setUserInput({ ...userInput, nickname: value });
        break;
      case "introduction":
        // 자기소개는 255자를 넘을 수 없다.
        if (value.length <= 255) {
          setUserInput({ ...userInput, introduction: value });
        }
        break;
    }
  };

  return (
    <div className="px-10">
      <div className="flex gap-5 mt-36">
        <button
          className="font-black"
          onClick={() => {
            setUserInput({ ...userInput, nickname: "", introduction: "" });
            onPrev?.();
          }}
        >
          &lt;
        </button>
        <h1 className="text-xl font-black text-normal-700">
          회원 정보를 입력해 주세요.
        </h1>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-10 mt-10">
        <div>
          <p className="text-sm text-positive-400 font-bold">
            연동된 이메일 계정
          </p>
          <p>jongwoo@google.com</p>
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
                className="focus-visible:ring-1 focus-visible:ring-positive-400 focus-visible:ring-offset-0"
              />
            </div>

            <DamulButton variant="positive" onClick={() => {}}>
              중복 확인
            </DamulButton>
          </div>

          <p className="absolute -bottom-6 text-sm text-negative-400 min-h-5">
            {infoText}
          </p>
        </div>

        <div className="flex flex-col justify-end w-full">
          <Label
            htmlFor="introduction"
            className="text-sm text-positive-400 font-bold"
          >
            자기소개
          </Label>
          <Textarea
            id="introduction"
            name="introduction"
            className="resize-none focus-visible:ring-1 focus-visible:ring-positive-400 focus-visible:ring-offset-0"
            placeholder="회원님에 대해 자유롭게 소개해 보세요."
            value={userInput.introduction}
            onChange={handleInput}
          />
          <p
            className={`text-end text-xs  ${userInput.introduction.length === 255 ? "text-negative-400" : "text-normal-400"}`}
          >
            {userInput.introduction.length} / 255
          </p>
        </div>

        <DamulButton
          variant="positive"
          size="full"
          textSize="base"
          onClick={() => {}}
        >
          가입하기
        </DamulButton>
      </form>
    </div>
  );
};

export default InfoForm;
