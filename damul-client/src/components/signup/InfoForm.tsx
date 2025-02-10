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
import { UserInfo } from "@/pages/signup/SignUpPage";
import GoogleIcon from "../svg/GoogleIcon";
import KakaoIcon from "../svg/KakaoIcon";
import NaverIcon from "../svg/NaverIcon";

interface InfoFormProps {
  email: string;
  userInfo: UserInfo;
  setUserInfo: Dispatch<SetStateAction<UserInfo>>;
  onPrev: () => void;
}

const InfoForm = ({ email, userInfo, setUserInfo, onPrev }: InfoFormProps) => {
  const [status, setStatus] = useState<
    "none" | "available" | "duplicate" | "validLength"
  >("none");
  const nav = useNavigate();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newStatus = await checkNickname();
    if (newStatus === "available") {
      const response = await signUp(userInfo);
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
        setUserInfo({ ...userInfo, nickname: value });
        break;
      case "selfIntroduction":
        if (value.length <= 255) {
          setUserInfo({ ...userInfo, selfIntroduction: value });
        }
        break;
    }
  };

  const checkNickname = async () => {
    if (!isValidNickname(userInfo.nickname)) {
      return "validLength";
    } else {
      const response = await checkNicknameDuplication(userInfo.nickname);
      console.log(response);
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

  const getEmailIcon = () => {
    if (email.endsWith("gmail.com")) {
      return <GoogleIcon className="size-5" />;
    } else if (email.endsWith("kakao.com")) {
      return <KakaoIcon className="size-5" />;
    } else if (email.endsWith("naver.com")) {
      return <NaverIcon className="size-5" />;
    }
  };

  return (
    <div className="px-10">
      <div className="flex gap-5 mt-10">
        <button
          className="font-black"
          onClick={() => {
            setUserInput({ ...userInput, nickname: "", introduction: "" });
            onPrev?.();
          }}
        >
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
          <div className="flex items-center gap-2">
            {getEmailIcon()}
            <p>{email}</p>
          </div>
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
                value={userInfo.nickname}
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
            className={clsx("absolute text-sm text-negative-400", {
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
            value={userInfo.selfIntroduction}
            onChange={handleInput}
          />
          <p className="absolute right-0 -bottom-5 text-xs">
            {userInfo.selfIntroduction.length} / 255
          </p>
        </div>

        <DamulButton type="submit" variant="positive" className="w-full mt-6">
          가입하기
        </DamulButton>
      </form>
    </div>
  );
};

export default InfoForm;
