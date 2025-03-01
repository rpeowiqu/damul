import useOverlayStore from "@/stores/overlayStore";
import { useEffect } from "react";

const useCloseOnBack = (key: string, onClose?: () => void) => {
  const { overlaySet, closeOverlay } = useOverlayStore();

  // 뒤로가기가 아닌, Overlay를 클릭해서 닫을 경우 Modal, Drawer 컴포넌트의 onOpenChange에서 history.back()를 반드시 호출하여 히스토리를 제거해야 한다.
  useEffect(() => {
    if (overlaySet.has(key)) {
      return;
    }

    const handlePopState = () => {
      closeOverlay(key, onClose);
    };
    // console.log("AddEventListner", key);
    window.addEventListener("popstate", handlePopState);

    return () => {
      // console.log("removeEventListener", key);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);
};

export default useCloseOnBack;
