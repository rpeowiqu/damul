import { Dispatch, SetStateAction, useState } from "react";
import TermsForm from "@/components/signup/TermForm";
import InfoForm from "@/components/signup/InfoForm";

enum SignUpStep {
  TERMS,
  INFO,
}

interface UserInput {
  selectBit: number;
  nickname: string;
  introduction: string;
}

export interface SignUpFormProps {
  userInput: UserInput;
  setUserInput: Dispatch<SetStateAction<UserInput>>;
  onNext?: () => void;
  onPrev?: () => void;
}

const SignUpPage = () => {
  const [step, setStep] = useState<SignUpStep>(SignUpStep.TERMS);
  const [userInput, setUserInput] = useState({
    selectBit: 0,
    nickname: "",
    introduction: "",
  });

  const currentForm = () => {
    switch (step) {
      case SignUpStep.TERMS:
      default:
        return (
          <TermsForm
            userInput={userInput}
            setUserInput={setUserInput}
            onNext={() => setStep(SignUpStep.INFO)}
          />
        );
      case SignUpStep.INFO:
        return (
          <InfoForm
            userInput={userInput}
            setUserInput={setUserInput}
            onPrev={() => setStep(SignUpStep.TERMS)}
          />
        );
    }
  };

  return currentForm();
};

export default SignUpPage;
