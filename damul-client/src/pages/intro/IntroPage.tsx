import IntroContent from "@/components/intro/IntroContent";
import LoadingScreen from "@/components/intro/LoadingScreen";
import { useState } from "react";

const IntroPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  return <IntroContent />;

  // return isLoading ? (
  //   <LoadingScreen setIsLoading={setIsLoading} />
  // ) : (
  //   <IntroContent />
  // );
};

export default IntroPage;
