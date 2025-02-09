import { useEffect, useRef, useState } from "react";
import TermsForm from "@/components/signup/TermForm";
import InfoForm from "@/components/signup/InfoForm";
import { consent } from "@/service/auth";

enum SignUpStep {
  TERMS,
  INFO,
}

export interface UserInput {
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
  const [userInput, setUserInput] = useState<UserInput>({
    nickname: "",
    selfIntroduction: "",
  });
  const terms = useRef<Term[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await consent();
      if (response) {
        setEmail(response.data.email);
        setUserInput({ ...userInput, nickname: response.data.nickname });
        terms.current = response.data.terms;
      }
    };

    fetchData();
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
            userInput={userInput}
            setUserInput={setUserInput}
            onPrev={() => setStep(SignUpStep.TERMS)}
          />
        );
    }
  };

  return <div>{currentForm()}</div>;
};

export default SignUpPage;
