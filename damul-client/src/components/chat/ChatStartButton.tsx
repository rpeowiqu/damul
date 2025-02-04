import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DamulButton from "../common/DamulButton";
import PlusIcon from "../svg/PlusIcon";

interface ChatStartButtonProps {
  to: string;
}

const ChatStartButton = ({ to }: ChatStartButtonProps) => {
  const navigate = useNavigate();
  const [rightOffset, setRightOffset] = useState(20); // 초기값

  useEffect(() => {
    const updatePosition = () => {
      const screenWidth = window.innerWidth;
      const contentWidth = 600;
      const margin = 20; // 버튼과 컨텐츠 오른쪽 간격
      if (screenWidth > contentWidth) {
        setRightOffset((screenWidth - contentWidth) / 2 + margin);
      } else {
        setRightOffset(margin); // 화면이 작아지면 그냥 margin 유지
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, []);

  return (
    <div className="fixed bottom-20" style={{ right: `${rightOffset}px` }}>
      <DamulButton
        variant="round"
        px={3}
        onClick={() => {
          navigate(`${to}`);
        }}
      >
        <PlusIcon />
      </DamulButton>
    </div>
  );
};

export default ChatStartButton;
