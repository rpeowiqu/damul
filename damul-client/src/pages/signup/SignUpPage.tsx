import { useEffect, useRef, useState } from "react";
import TermsForm from "@/components/signup/TermForm";
import InfoForm from "@/components/signup/InfoForm";
import { consent } from "@/service/auth";

enum SignUpStep {
  TERMS,
  INFO,
}

export interface UserInfo {
  nickname: string;
  selfIntroduction: string;
}

export interface Term {
  id: number;
  title: string;
  content: string;
}

const SignUpPage = () => {
  const [step, setStep] = useState<SignUpStep>(SignUpStep.TERMS);
  const [selectBit, setSelectBit] = useState<number>(0);
  const [email, setEmail] = useState<string>("");
  const [userInfo, setUserInfo] = useState<UserInfo>({
    nickname: "",
    selfIntroduction: "",
  });
  const terms = useRef<Term[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSignUpInfo = async () => {
      try {
        const response = await consent();
        if (response) {
          setEmail(response.data.email);
          setUserInfo({ ...userInfo, nickname: response.data.nickname });
          terms.current = response.data.terms;
        }
      } catch (error) {
        // console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSignUpInfo();
  }, []);

  const currentForm = () => {
    switch (step) {
      case SignUpStep.TERMS:
        return (
          <TermsForm
            selectBit={selectBit}
            setSelectBit={setSelectBit}
            terms={terms.current}
            onNext={() => setStep(SignUpStep.INFO)}
          />
        );
      case SignUpStep.INFO:
        return (
          <InfoForm
            email={email}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            onPrev={() => setStep(SignUpStep.TERMS)}
          />
        );
    }
  };

  if (isLoading) {
    return null;
  }

  return <div className="px-6 sm:px-10 py-8">{currentForm()}</div>;
};

export default SignUpPage;
