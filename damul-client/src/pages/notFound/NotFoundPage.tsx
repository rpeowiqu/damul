import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MeatIcon,
  FruitIcon,
  VegetableIcon,
  DairyIcon,
} from "@/components/svg";
import HomeIcon from "@/components/svg/HomeIcon";
import ProfileIcon from "@/components/svg/ProfileIcon";
import DamulButton from "@/components/common/DamulButton";
import logo from "../../../public/logo.svg";

const NotFoundPage = () => {
  const [isJumping, setIsJumping] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const characterRef = useRef<HTMLDivElement | null>(null);
  const obstacleRef = useRef<HTMLDivElement | null>(null);
  const requestRef = useRef<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (gameOver) return;

    let position = 100;
    let obstacleSpeed = 1;

    const moveObstacle = () => {
      if (!obstacleRef.current) return;

      position -= obstacleSpeed;
      obstacleRef.current.style.left = `${position}%`;

      if (position <= -5) {
        setScore((prev) => prev + 1);
        position = 100;
      }

      if (!gameOver) {
        requestRef.current = requestAnimationFrame(moveObstacle);
      }
    };

    requestRef.current = requestAnimationFrame(moveObstacle);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameOver]);

  useEffect(() => {
    if (gameOver) return;
    const checkCollision = setInterval(() => {
      if (!characterRef.current || !obstacleRef.current) return;

      const charBottom = parseInt(
        window.getComputedStyle(characterRef.current).bottom,
      );
      const obsLeft = parseInt(
        window.getComputedStyle(obstacleRef.current).left,
      );

      if (obsLeft < 70 && obsLeft > 30 && charBottom <= 20) {
        setGameOver(true);
      }
    }, 50);

    return () => clearInterval(checkCollision);
  }, [gameOver]);

  useEffect(() => {
    if (score > 4) {
      navigate("/home");
    }
  }, [score, navigate]);

  const jump = () => {
    if (isJumping || gameOver) return;
    setIsJumping(true);

    let jumpHeight = 0;
    let goingUp = true;

    const jumpStep = () => {
      if (!characterRef.current) return;

      if (goingUp) {
        jumpHeight += 5;
        if (jumpHeight >= 80) goingUp = false;
      } else {
        jumpHeight -= 5;
        if (jumpHeight <= 0) {
          setIsJumping(false);
          return;
        }
      }

      characterRef.current.style.bottom = `${jumpHeight}px`;
      requestAnimationFrame(jumpStep);
    };

    requestAnimationFrame(jumpStep);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space") jump();
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-[600px] border-x-1 border-neutral-100 m-auto bg-white">
      <img src={logo} className="w-24 mb-20" />
      <h1 className="text-xl font-bold mb-4">
        찾으시는 페이지가 없어요... 혹시 다른 길을 함께 찾아볼까요?
      </h1>
      <p className="text-gray-700 mb-4">
        🥕 식재료를 피하고 냉장고를 찾아가세요! (점프: SPACE)
      </p>

      <div
        className="relative w-[400px] h-[200px] bg-white border border-positive-300 overflow-hidden"
        onClick={jump} // 클릭 이벤트 추가
      >
        <div
          ref={characterRef}
          className="absolute bottom-0 left-10 w-10 h-10 items-center flex justify-center rounded-full bg-positive-300"
          style={{ bottom: "0px" }}
        >
          <ProfileIcon iconStroke="black" />
        </div>

        <div ref={obstacleRef} className="absolute bottom-0 left-full w-6 h-6">
          {score === 0 && <MeatIcon />}
          {score === 1 && <FruitIcon />}
          {score === 2 && <VegetableIcon />}
          {score === 3 && <DairyIcon />}
          {score === 4 && (
            <div className="absolute bottom-0 bg-neutral-300 w-9 h-9 items-center flex justify-center rounded-xl">
              <HomeIcon />
            </div>
          )}
        </div>
      </div>

      {gameOver ? (
        <p className="text-red-600 mt-4">💥 냉장고에 도착하지 못했어요 </p>
      ) : (
        <p className="mt-4">냉장고 앞까지: {5 - score}m</p>
      )}
      <div className="flex gap-3 mt-4">
        <DamulButton
          onClick={() => {
            setGameOver(false);
            setScore(0);
          }}
          variant="positive"
          className="px-4 py-2"
        >
          다시하기
        </DamulButton>
        <DamulButton
          onClick={() => {
            navigate("/home");
          }}
          variant="negative"
          className="px-4 py-2"
        >
          바로 홈으로 이동하기
        </DamulButton>
      </div>
    </div>
  );
};

export default NotFoundPage;
