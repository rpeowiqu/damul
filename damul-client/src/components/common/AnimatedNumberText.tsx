import { ReactNode, useEffect, useState } from "react";

interface AnimatedNumberTextProps {
  targetValue: number;
  duration: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

const AnimatedNumberText = ({
  targetValue,
  duration,
  className,
  prefix,
  suffix,
}: AnimatedNumberTextProps) => {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const startTime = performance.now();

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      if (elapsed < duration) {
        const progress = elapsed / duration;
        const newValue = Math.round(progress * targetValue);
        setCount(newValue);
        requestAnimationFrame(updateCounter);
      } else {
        setCount(targetValue);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [targetValue]);

  return (
    <span className={className}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

export default AnimatedNumberText;
