import { motion, useSpring, useScroll } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useRef, useState } from "react";

const IntroPage = () => {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const visibleSections = useRef<boolean[]>(new Array(5).fill(false));
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <>
      <motion.div
        id="scroll-indicator"
        // className="scaleX fixed top-0 left-0 right-0 w-full max-w-[600px] bg-positive-200"
        style={{
          scaleX,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 10,
          originX: 0,
          backgroundColor: "#ff0088",
        }}
      />

      <div className="space-y-48 p-10">
        {[...Array(5)].map((_, index) => {
          const { ref, inView } = useInView({
            triggerOnce: false, // 다시 보이면 재실행
            threshold: 0.3, // 10% 이상 보이면 실행
          });

          if (inView) {
            visibleSections.current[index] = true;
          } else {
            visibleSections.current[index] = false; // 다시 숨겨지면 false로 변경
          }

          return (
            <motion.div
              key={index}
              ref={(el) => {
                ref(el); // Intersection Observer 연결
                sectionRefs.current[index] = el; // ref 배열에 저장
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={
                visibleSections.current[index]
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 30 }
              }
              transition={{ duration: 0.6 }}
              className="bg-white shadow-lg h-36 rounded-xl"
            >
              <h2 className="text-xl font-bold">Section {index + 1}</h2>
              <p className="text-gray-600">
                스크롤 시 페이드인 되는 영역입니다.
              </p>
            </motion.div>
          );
        })}
      </div>
    </>
  );
};

export default IntroPage;
