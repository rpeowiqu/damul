import { useState } from "react";
import IntroContent from "@/components/intro/IntroContent";
import LoadingScreen from "@/components/intro/LoadingScreen";

const IntroPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  return isLoading ? (
    <LoadingScreen setIsLoading={setIsLoading} />
  ) : (
    <IntroContent />
  );
};

export default IntroPage;
