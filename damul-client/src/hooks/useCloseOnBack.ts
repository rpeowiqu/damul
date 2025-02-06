import { Dispatch, SetStateAction, useEffect, useState } from "react";

const useCloseOnBack = (
  onPopState?: () => void,
): [boolean, Dispatch<SetStateAction<boolean>>] => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // 뒤로가기가 아닌, Overlay를 클릭해서 닫을 경우 Modal, Drawer 컴포넌트에서 history.back()를 반드시 호출해야 한다.
  useEffect(() => {
    const handlePopState = () => {
      setIsOpen(false);
      onPopState?.();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      history.pushState(null, "", window.location.pathname);
    }
  }, [isOpen]);

  return [isOpen, setIsOpen];
};

export default useCloseOnBack;
